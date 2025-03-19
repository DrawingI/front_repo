import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

const ChatRoomNameScreen = ({ route, navigation }) => {
  const { selectedMembers } = route.params; // 이전 화면에서 선택한 멤버 리스트
  const [chatRoomName, setChatRoomName] = useState("");

  return (
    <SafeAreaView style={tw`flex-1 bg-white px-4 py-6`}>
      {/* 상단 헤더 */}
      <View style={tw`flex-row items-center mb-6`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>채팅방 이름</Text>
      </View>

      {/* 채팅방 프로필 이미지 (추가 예정) */}
      <View style={tw`items-center mb-6`}>
        <Ionicons name="person-circle-outline" size={80} color="gray" />
      </View>

      {/* 채팅방 이름 입력 */}
      <Text style={tw`text-lg font-bold mb-2`}>채팅방 이름</Text>
      <TextInput
        style={tw`border border-gray-300 p-4 rounded-lg text-lg`}
        placeholder="채팅방 이름을 입력해주세요"
        value={chatRoomName}
        onChangeText={setChatRoomName}
      />
    </SafeAreaView>
  );
};

export default ChatRoomNameScreen;
