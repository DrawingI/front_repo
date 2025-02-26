import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, StatusBar, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

// 🔹 백엔드 서버 주소 (실제 IP로 변경 가능)
const LOCAL_SERVER_URL = "http://localhost:5000";

const ChildListScreen = ({ navigation, route }) => {
  const [children, setChildren] = useState([]);

  // 🔹 한국 나이 계산 함수
  const calculateKoreanAge = (birthdate) => {
    if (!birthdate || birthdate.length !== 6) return "알 수 없음";

    const birthYearPrefix = birthdate.startsWith("0") ? 2000 : 1900;
    const birthYear = birthYearPrefix + parseInt(birthdate.substring(0, 2), 10);
    const currentYear = new Date().getFullYear();

    return `${currentYear - birthYear + 1}살`;
  };

  // 🔹 아이 추가 함수 (백엔드 요청)
  const addNewChild = async (newChild) => {
    try {
      const response = await fetch(`${LOCAL_SERVER_URL}/register-child`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newChild),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("등록 성공!", "아이 정보가 등록되었습니다.");
        setChildren([...children, data.child]); // 🔹 등록된 아이를 리스트에 추가
      } else {
        Alert.alert("등록 실패", data.message || "아이 등록 중 오류 발생!");
      }
    } catch (error) {
      console.error("❌ 아이 등록 오류:", error);
      Alert.alert("서버 오류", "서버에 연결할 수 없습니다.");
    }
  };

  // 🔹 아이 삭제 기능 (백엔드 요청)
  const deleteChild = async (childId) => {
    Alert.alert("삭제 확인", "정말 이 아이를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: async () => {
          try {
            const response = await fetch(`${LOCAL_SERVER_URL}/children/${childId}`, {
              method: "DELETE",
            });

            const data = await response.json();
            if (response.ok) {
              Alert.alert("삭제 완료", "아이 정보가 삭제되었습니다.");
              setChildren(children.filter((child) => child.id !== childId)); // 🔹 삭제된 아이를 목록에서 제거
            } else {
              Alert.alert("삭제 실패", data.message || "아이 삭제 중 오류 발생!");
            }
          } catch (error) {
            console.error("❌ 아이 삭제 오류:", error);
            Alert.alert("서버 오류", "서버에 연결할 수 없습니다.");
          }
        },
      },
    ]);
  };

  // 🔹 아이 등록 후 업데이트
  useEffect(() => {
    if (route.params?.newChild) {
      addNewChild(route.params.newChild);
    }
  }, [route.params?.newChild]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={[tw`flex-1`, { paddingTop: StatusBar.currentHeight || 20 }]}>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center px-6 py-4 border-b`}>
          <Text style={tw`text-xl font-bold`}>HTP</Text>
          <View style={tw`flex-row items-center`}>
            <Ionicons name="notifications-outline" size={24} style={tw`mr-4`} />
            <Ionicons name="settings-outline" size={24} />
          </View>
        </View>

        {/* 상단 버튼 */}
        <View style={tw`flex-row justify-around px-6 py-3 border-b border-gray-200 bg-gray-100`}>
          {/* 아이 등록하기 버튼 */}
          <TouchableOpacity
            style={tw`flex-1 flex-row items-center justify-center border border-gray-300 py-3 rounded-lg mr-2`}
            onPress={() => navigation.navigate("ChildRegister")}
          >
            <Ionicons name="person-add-outline" size={20} color="black" style={tw`mr-2`} />
            <Text style={tw`text-gray-700`}>아이 등록하기</Text>
          </TouchableOpacity>

          {/* 아이 불러오기 버튼 */}
          <TouchableOpacity
            style={tw`flex-1 flex-row items-center justify-center border border-gray-300 py-3 rounded-lg ml-2`}
            onPress={() => navigation.navigate("ChildRetrieve")}
          >
            <Ionicons name="download-outline" size={20} color="black" style={tw`mr-2`} />
            <Text style={tw`text-gray-700`}>아이 불러오기</Text>
          </TouchableOpacity>
        </View>

        {/* 아이 목록 */}
        <FlatList
          data={children}
          keyExtractor={(item) => item.id.toString()} // 백엔드에서 받은 아이 ID 사용
          renderItem={({ item }) => (
            <View style={tw`m-4 p-4 border rounded-lg bg-white shadow-sm flex-row justify-between items-center`}>
              <View style={tw`flex-row items-center`}>
                <Ionicons name="person-circle-outline" size={48} color="gray" style={tw`mr-4`} />
                <View>
                  <Text style={tw`text-sm text-gray-500`}>
                    {calculateKoreanAge(item.birthdate)} / {item.gender}
                  </Text>
                  <Text style={tw`text-lg font-semibold`}>{item.name}</Text>
                </View>
              </View>

              {/* 삭제 버튼 */}
              <TouchableOpacity onPress={() => deleteChild(item.id)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={tw`flex-1 justify-center items-center`}>
              <Text style={tw`text-gray-500 text-lg`}>등록된 아이가 없습니다</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ChildListScreen;