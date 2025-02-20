import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "tailwind-react-native-classnames";

// 🔹 백엔드 서버 주소 (PC의 로컬 IP 사용)
const LOCAL_SERVER_URL = "http://172.30.1.94:5000";

const ChildRegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [relationship, setRelationship] = useState("보호자");
  const [image, setImage] = useState(null);

  // 이미지 선택 함수
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 생년월일 유효성 검사 함수
  const isValidBirthdate = (date) => {
    if (date.length !== 6 || isNaN(date)) return false;
    const year = parseInt(date.substring(0, 2), 10);
    const month = parseInt(date.substring(2, 4), 10);
    const day = parseInt(date.substring(4, 6), 10);
    return month >= 1 && month <= 12 && day >= 1 && day <= 31;
  };

  // 🔹 API 연동: 아이 등록 함수
  const handleRegister = async () => {
    if (!name || !birthdate || !selectedGender) {
      Alert.alert("경고", "모든 정보를 입력해주세요.");
      return;
    }

    if (!isValidBirthdate(birthdate)) {
      Alert.alert("경고", "올바른 생년월일을 입력해주세요. (YYMMDD 형식)");
      return;
    }

    const newChild = { name, birthdate, gender: selectedGender, relationship, image };

    try {
      console.log("🔹 서버로 아이 정보 전송 중...");

      const response = await fetch(`${LOCAL_SERVER_URL}/register-child`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newChild),
      });

      const data = await response.json();
      console.log("🔹 서버 응답:", data);

      if (response.ok) {
        Alert.alert("등록 성공!", "아이 정보가 성공적으로 등록되었습니다.");
        navigation.navigate("ChildList", { updatedChildren: data.children }); // 🔹 등록 후 ChildList로 이동
      } else {
        Alert.alert("등록 실패", data.message || "아이 등록 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("❌ 서버 요청 중 오류 발생:", error);
      Alert.alert("서버 오류", "서버에 연결할 수 없습니다.");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white px-6 justify-center`}>
      {/* 제목 */}
      <Text style={tw`text-2xl font-bold text-center mb-6`}>아이 등록하기</Text>

      {/* 프로필 이미지 */}
      <View style={tw`items-center mb-6`}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={tw`w-32 h-32 rounded-full`} />
          ) : (
            <View style={tw`w-32 h-32 rounded-full bg-gray-200 justify-center items-center`}>
              <Ionicons name="camera" size={32} color="gray" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 아이와의 관계 */}
      <Text style={tw`text-gray-700 text-lg mb-2`}>아이와의 관계</Text>
      <View style={tw`flex-row mb-4`}>
        <TouchableOpacity
          style={[
            tw`px-6 py-3 rounded-lg border mr-2`,
            relationship === "보호자" ? tw`border-yellow-500 bg-yellow-200` : tw`border-gray-300`,
          ]}
          onPress={() => setRelationship("보호자")}
        >
          <Text style={tw`text-lg ${relationship === "보호자" ? "text-yellow-600" : "text-gray-700"}`}>보호자</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tw`px-6 py-3 rounded-lg border`,
            relationship === "선생님" ? tw`border-yellow-500 bg-yellow-200` : tw`border-gray-300`,
          ]}
          onPress={() => setRelationship("선생님")}
        >
          <Text style={tw`text-lg ${relationship === "선생님" ? "text-yellow-600" : "text-gray-700"}`}>선생님</Text>
        </TouchableOpacity>
      </View>

      {/* 입력 필드 */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-700 text-lg mb-2`}>아이 이름</Text>
        <TextInput
          style={tw`border border-gray-300 p-4 rounded-lg text-lg`}
          placeholder="아이 이름 입력"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-700 text-lg mb-2`}>생년월일 (YYMMDD)</Text>
        <TextInput
          style={tw`border border-gray-300 p-4 rounded-lg text-lg`}
          placeholder="YYMMDD"
          value={birthdate}
          onChangeText={setBirthdate}
          keyboardType="numeric"
        />
      </View>

      {/* 성별 선택 */}
      <Text style={tw`text-gray-700 text-lg mb-2`}>성별</Text>
      <View style={tw`flex-row mb-6`}>
        <TouchableOpacity
          style={[
            tw`px-6 py-3 rounded-lg border mr-2`,
            selectedGender === "여자" ? tw`border-yellow-500 bg-yellow-200` : tw`border-gray-300`,
          ]}
          onPress={() => setSelectedGender("여자")}
        >
          <Text style={tw`text-lg ${selectedGender === "여자" ? "text-yellow-600" : "text-gray-700"}`}>여자</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tw`px-6 py-3 rounded-lg border`,
            selectedGender === "남자" ? tw`border-yellow-500 bg-yellow-200` : tw`border-gray-300`,
          ]}
          onPress={() => setSelectedGender("남자")}
        >
          <Text style={tw`text-lg ${selectedGender === "남자" ? "text-yellow-600" : "text-gray-700"}`}>남자</Text>
        </TouchableOpacity>
      </View>

      {/* 등록 버튼 */}
      <TouchableOpacity style={tw`bg-black py-4 rounded-lg`} onPress={handleRegister}>
        <Text style={tw`text-white text-center text-lg`}>등록하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChildRegisterScreen;
