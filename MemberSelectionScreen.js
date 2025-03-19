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

  // 보호자 및 선생님 목록 불러오기
  const fetchMembers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("인증 오류", "로그인이 필요합니다.");
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(`${LOCAL_SERVER_URL}/child/getMembers/${child.id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setMembers(data.members);
      } else {
        Alert.alert("불러오기 실패", data.message || "멤버 목록을 불러오는 중 오류 발생!");
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

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* 상단 헤더 */}
      <View style={tw`flex-row items-center px-4 py-4 border-b`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>멤버 구성하기</Text>
        <TouchableOpacity style={tw`ml-auto`} onPress={() => console.log("완료 버튼 클릭")}>
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

      {/* 완료 버튼 */}
      <TouchableOpacity
        style={tw`bg-black py-3 mx-4 my-4 rounded-lg`}
        onPress={() => console.log("완료 버튼 클릭")}
      >
        <Text style={tw`text-white text-center text-lg font-bold`}>완료</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MemberSelectionScreen;
