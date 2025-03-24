import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL_SERVER_URL = "http://localhost:5000"; // 실제 서버 주소로 변경 필요

const MemberSelectionScreen = ({ route, navigation }) => {
  const { child } = route.params; // 이전 화면에서 넘겨받은 아이 정보
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]); // 선택된 멤버
  const [selectedChildId, setSelectedChildId] = useState(null);

  // 보호자 및 선생님 목록 불러오기
  const fetchMembers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("인증 오류", "로그인이 필요합니다.");
        navigation.navigate("Login");
        return;
      }

      console.log("📌 토큰:", token); // 디버그용 로그
      console.log("📌 아이 ID:", child.id); // 디버그용 로그

      const response = await fetch(`${LOCAL_SERVER_URL}/chat/findUsersToChat`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          childid: child.id, // 현재 선택된 아이 ID 전송
        }),
      });

      const data = await response.json();
      console.log("📌 서버 응답 데이터:", data);

      if (response.ok) {
        // userids가 배열인지 확인
        if (Array.isArray(data.userids)) {
          const formattedMembers = data.userids.map((user) => {
            console.log("📌 유저 데이터:", user);
            return {
              id: user.id,
              name: user.name || "이름 없음", // 이름이 없다면 기본값 설정
              profImgUrl: user.profImgUrl || null, // 이미지 URL이 없는 경우
              role: user.role || "역할 없음", // 역할 정보가 없는 경우
            };
          });
          setMembers(formattedMembers);
        } else {
          Alert.alert("불러오기 실패", "채팅 가능한 멤버 목록이 없습니다.");
        }
      } else {
        Alert.alert("불러오기 실패", data.message || "채팅 가능한 멤버 목록을 불러오는 중 오류 발생!");
      }
    } catch (error) {
      console.error("❌ 멤버 목록 불러오기 오류:", error);
      Alert.alert("서버 오류", "서버에 연결할 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 멤버 선택/해제 기능
  const toggleMemberSelection = (member) => {
    if (selectedMembers.some((m) => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id)); // 선택 해제
    } else {
      setSelectedMembers([...selectedMembers, member]); // 선택 추가
    }
  };

  // "다음" 버튼 클릭 시 채팅방 이름 설정 화면으로 이동
  const handleNext = () => {
      if (selectedMembers.length === 0) {
          Alert.alert("알림", "채팅방에 추가할 멤버를 선택해주세요.");
          return;
      }
      navigation.navigate("ChatRoomName", {
        selectedMembers: selectedMembers,
        childId: selectedChildId
      });
  };


  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* 상단 헤더 */}
      <View style={tw`flex-row items-center px-4 py-4 border-b`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>멤버 구성하기</Text>
        <TouchableOpacity style={tw`ml-auto`} onPress={handleNext}>
          <Text style={tw`text-blue-500 text-lg`}>다음</Text>
        </TouchableOpacity>
      </View>

      {/* 선택된 멤버 UI */}
      <View style={tw`flex-row px-4 py-2 border-b`}>
        {selectedMembers.map((member) => (
          <View key={member.id} style={tw`mr-3 items-center`}>
            {member.profImgUrl ? (
              <Image source={{ uri: member.profImgUrl }} style={tw`w-12 h-12 rounded-full`} />
            ) : (
              <Ionicons name="person-circle-outline" size={48} color="gray" />
            )}
            <Text style={tw`text-xs mt-1`}>{member.name}</Text>
            <TouchableOpacity onPress={() => toggleMemberSelection(member)}>
              <Ionicons name="close-circle" size={18} color="gray" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 보호자 및 선생님 목록 */}
      <FlatList
        data={members}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`flex-row items-center justify-between p-4 border-b`}
            onPress={() => toggleMemberSelection(item)}
          >
            <View style={tw`flex-row items-center`}>
              {item.profImgUrl ? (
                <Image source={{ uri: item.profImgUrl }} style={tw`w-12 h-12 rounded-full mr-3`} />
              ) : (
                <Ionicons name="person-circle-outline" size={48} color="gray" style={tw`mr-3`} />
              )}
              <View>
                <Text style={tw`text-lg font-bold`}>{item.name}</Text>
                <Text style={tw`text-gray-500`}>
                  {item.role === "guardian" ? "보호자" : "선생님"}
                </Text>
              </View>
            </View>
            {/* 선택 여부를 체크 아이콘으로 표시 */}
            <Ionicons
              name={selectedMembers.some((m) => m.id === item.id) ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={selectedMembers.some((m) => m.id === item.id) ? "orange" : "gray"}
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default MemberSelectionScreen;
