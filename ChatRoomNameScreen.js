import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL_SERVER_URL = "http://localhost:5000";

const ChatRoomNameScreen = ({ route, navigation }) => {
  const { selectedMembers, childId } = route.params; // 이전 화면에서 선택한 멤버 리스트와 아이 ID
  const [chatRoomName, setChatRoomName] = useState("");

  console.log("📌 ChatRoomNameScreen - childId:", childId);
  console.log("📌 ChatRoomNameScreen - selectedMembers:", selectedMembers);

  // 채팅방 만들기 함수
  const createChatRoom = async () => {
    if (!chatRoomName.trim()) {
      Alert.alert("오류", "채팅방 이름을 입력해주세요.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("인증 오류", "로그인이 필요합니다.");
        navigation.navigate("Login");
        return;
      }

      // 선택된 멤버들의 ID 배열 생성
      const userIds = selectedMembers.map((member) => member.id);
      console.log("📌 생성 요청 - chatRoomName:", chatRoomName);
      console.log("📌 생성 요청 - childId:", childId);
      console.log("📌 생성 요청 - userIds:", userIds);

      const response = await fetch(`${LOCAL_SERVER_URL}/chat/createChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: chatRoomName,
          childid: childId,
          userids: userIds,
        }),
      });

      const data = await response.json();
      console.log("📌 서버 응답 데이터:", data);

      if (response.ok) {
        Alert.alert("채팅방 생성 성공", "채팅방이 성공적으로 생성되었습니다!");
        console.log("🔗 Communication으로 네비게이트");
        // 채팅방 ID와 데이터를 함께 전달
        navigation.navigate("Communication", {
          chatId: data.chat.id,
          chatName: chatRoomName,
        });
      } else {
        Alert.alert("채팅방 생성 실패", data.message || "채팅방을 만들 수 없습니다.");
      }
    } catch (error) {
      console.error("❌ 채팅방 생성 오류:", error);
      Alert.alert("서버 오류", "서버에 연결할 수 없습니다.");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white px-4 py-6`}>
      {/* 상단 헤더 */}
      <View style={tw`flex-row items-center mb-6`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>채팅방 이름</Text>
        <TouchableOpacity onPress={createChatRoom} style={tw`ml-auto`}>
          <Text style={tw`text-blue-500 text-lg`}>확인</Text>
        </TouchableOpacity>
      </View>

      {/* 채팅방 프로필 이미지 */}
      <View style={tw`items-center mb-6`}>
        <Ionicons name="person-circle-outline" size={80} color="gray" />
      </View>

      {/* 채팅방 이름 입력 */}
      <Text style={tw`text-lg font-bold mb-2`}>채팅방 이름</Text>
      <TextInput
        style={tw`border border-gray-300 p-4 rounded-lg text-lg mb-6`}
        placeholder="채팅방 이름을 입력해주세요"
        value={chatRoomName}
        onChangeText={setChatRoomName}
      />

      {/* 완료 버튼 */}
      <TouchableOpacity onPress={createChatRoom} style={tw`bg-black py-3 rounded-lg`}>
        <Text style={tw`text-white text-center text-lg`}>채팅방 만들기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChatRoomNameScreen;
