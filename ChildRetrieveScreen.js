import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import tw from "tailwind-react-native-classnames";

const ChildRetrieveScreen = ({ navigation }) => {
  const [relationship, setRelationship] = useState("보호자");
  const [childCode, setChildCode] = useState("");

  return (
    <SafeAreaView style={tw`flex-1 bg-white px-6 py-6`}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mb-4`}>
        <Text style={tw`text-lg text-gray-700`}>←</Text>
      </TouchableOpacity>

      {/* 제목 */}
      <Text style={tw`text-2xl font-bold text-left mb-4`}>
        HTP 검사를 위해 아이의{"\n"}아이 코드를 입력해 주세요!
      </Text>

      {/* 아이와의 관계 선택 */}
      <Text style={tw`text-gray-700 text-lg mb-2`}>아이와의 관계</Text>
      <View style={tw`flex-row mb-4`}>
        <TouchableOpacity
          style={[
            tw`px-6 py-3 rounded-lg border mr-2`,
            relationship === "보호자" ? tw`border-yellow-500 bg-yellow-200` : tw`border-gray-300`,
          ]}
          onPress={() => setRelationship("보호자")}
        >
          <Text style={tw`text-lg ${relationship === "보호자" ? "text-yellow-600" : "text-gray-700"}`}>
            보호자
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            tw`px-6 py-3 rounded-lg border`,
            relationship === "선생님" ? tw`border-yellow-500 bg-yellow-200` : tw`border-gray-300`,
          ]}
          onPress={() => setRelationship("선생님")}
        >
          <Text style={tw`text-lg ${relationship === "선생님" ? "text-yellow-600" : "text-gray-700"}`}>
            선생님
          </Text>
        </TouchableOpacity>
      </View>

      {/* 아이 코드 입력 */}
      <Text style={tw`text-gray-700 text-lg mb-2`}>아이 코드</Text>
      <TextInput
        style={tw`border border-gray-300 p-4 rounded-lg text-lg mb-6`}
        placeholder="아이 코드 입력"
        value={childCode}
        onChangeText={setChildCode}
      />

      {/* 불러오기 버튼 */}
      <TouchableOpacity
        style={tw`bg-black py-4 rounded-lg`}
        onPress={() => alert(`아이 코드: ${childCode} 불러오기`)}
      >
        <Text style={tw`text-white text-center text-lg`}>불러오기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChildRetrieveScreen;
