import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import tw from "tailwind-react-native-classnames";
import AsyncStorage from "@react-native-async-storage/async-storage";


const LOCAL_SERVER_URL = "http://localhost:5000";

const ChildRetrieveScreen = ({ navigation }) => {
  const [relationship, setRelationship] = useState("보호자");
  const [childCode, setChildCode] = useState("");
  const [childData, setChildData] = useState(null); // 🔹 불러온 아이 정보를 저장

  // 아이 코드로 아이 정보 불러오기 함수
  const fetchChildByCode = async () => {
      try {
          if (!childCode.trim()) {
              Alert.alert("입력 오류", "아이 코드를 입력해주세요.");
              return;
          }

          // 로그인 세션 토큰 가져오기
          const token = await AsyncStorage.getItem("token");
          if (!token) {
              Alert.alert("인증 오류", "로그인이 필요합니다.");
              navigation.navigate("Login");
              return;
          }

          console.log("📌 로그인 토큰:", token);
          console.log("📌 아이 공유 코드:", childCode);
          console.log("📌 관계 설정:", relationship);

          const response = await fetch(`${LOCAL_SERVER_URL}/child/getChildByToken`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`, // ✅ 로그인 세션 토큰을 올바르게 추가
              },
              body: JSON.stringify({
                  token: childCode,  // 입력한 아이 공유 코드
                  relationship: {
                      korean: relationship,  // "보호자" 또는 "선생님"
                      english: relationship === "보호자" ? "caretaker" : "teacher" // "caretaker" 또는 "teacher"
                  }
              }),
          });

          const data = await response.json();
          console.log("📌 Server Response:", data);

          if (response.ok) {
              setChildData(data.child);
              Alert.alert("불러오기 성공", `${data.child.name} 아이 정보를 불러왔습니다.`);
          } else {
              Alert.alert("불러오기 실패", data.message || "아이 정보를 불러올 수 없습니다.");
          }
      } catch (error) {
          console.error("❌ 아이 불러오기 오류:", error);
          Alert.alert("서버 오류", "서버에 연결할 수 없습니다.");
      }
  };

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
      <TouchableOpacity style={tw`bg-black py-4 rounded-lg`} onPress={fetchChildByCode}>
        <Text style={tw`text-white text-center text-lg`}>불러오기</Text>
      </TouchableOpacity>

      {/* 불러온 아이 정보 표시 */}
      {childData && (
        <View style={tw`mt-6 p-4 border rounded-lg bg-gray-100`}>
          <Text style={tw`text-lg font-bold`}>아이 정보</Text>
          <Text style={tw`text-gray-700`}>이름: {childData.name}</Text>
          <Text style={tw`text-gray-700`}>성별: {childData.gender === "female" ? "여자" : "남자"}</Text>
          <Text style={tw`text-gray-700`}>생년월일: {childData.birthdate}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChildRetrieveScreen;
