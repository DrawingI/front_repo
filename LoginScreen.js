import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ 토큰 저장을 위한 AsyncStorage 추가
import tw from "tailwind-react-native-classnames";

// 🔹 백엔드 서버 주소
const LOCAL_SERVER_URL = "http://localhost:5000";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ 로그인 API 요청 및 토큰 저장
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("입력 오류", "이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      // ✅ 백엔드 API 호출 (로그인)
      const response = await fetch(`${LOCAL_SERVER_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("로그인 성공!", "환영합니다 😊");

        // ✅ 토큰 저장 (AsyncStorage에 저장)
        await AsyncStorage.setItem("token", data.token);

        // ✅ 로그인 성공 후 아이 목록 화면으로 이동
        navigation.navigate("ChildList");
      } else {
        Alert.alert("로그인 실패", data.message || "이메일 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("❌ 로그인 오류:", error);
      Alert.alert("서버 오류", "서버에 연결할 수 없습니다.");
    }
  };

  return (
    <View style={tw`flex-1 bg-white items-center justify-center px-6`}>
      {/* 앱 제목 */}
      <Text style={[tw`text-4xl font-bold mb-2`, { color: "#F97316" }]}>
        Drawing i
      </Text>
      <Text style={tw`text-lg text-gray-500 mb-10`}>아이의 마음을 이해하는 창</Text>

      {/* Google 로그인 버튼 */}
      <TouchableOpacity
        style={tw`flex-row border border-gray-300 rounded-lg w-full py-4 px-4 items-center mb-4`}
      >
        <Image
          source={require("./assets/google_logo.png")}
          style={tw`w-6 h-6 mr-3`}
        />
        <Text style={tw`absolute left-0 right-0 text-lg text-black text-center`}>
          Google로 시작하기
        </Text>
      </TouchableOpacity>

      {/* 또는 구분선 */}
      <View style={tw`flex-row items-center w-full mb-4`}>
        <View style={tw`flex-1 h-0.5 bg-gray-300`} />
        <Text style={tw`mx-3 text-gray-400`}>또는</Text>
        <View style={tw`flex-1 h-0.5 bg-gray-300`} />
      </View>

      {/* 이메일 입력 */}
      <TextInput
        style={tw`w-full p-4 text-lg bg-gray-100 rounded-lg mb-3`}
        placeholder="이메일을 입력해주세요"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* 비밀번호 입력 */}
      <TextInput
        style={tw`w-full p-4 text-lg bg-gray-100 rounded-lg mb-6`}
        placeholder="비밀번호를 입력해주세요"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      {/* 로그인 버튼 */}
      <TouchableOpacity style={tw`bg-black w-full py-4 rounded-lg mb-4`} onPress={handleLogin}>
        <Text style={tw`text-white text-lg font-bold text-center`}>로그인</Text>
      </TouchableOpacity>

      {/* 하단 링크 */}
      <View style={tw`flex-row mb-6`}>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={tw`text-black font-bold mr-6`}>회원 가입</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={tw`text-gray-500 mr-6`}>이메일 찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={tw`text-gray-500`}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
