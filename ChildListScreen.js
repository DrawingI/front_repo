import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, SafeAreaView, FlatList, Image, Alert, Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL_SERVER_URL = "http://localhost:5000";

const ChildListScreen = ({ navigation, route }) => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [childCode, setChildCode] = useState("");

  // 🔹 아이 목록 불러오기
  const fetchChildren = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("인증 오류", "로그인이 필요합니다.");
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(`${LOCAL_SERVER_URL}/child/getAllChildrenByUser`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setChildren(data.children);
      } else {
        Alert.alert("불러오기 실패", data.message || "아이 목록을 불러오는 중 오류 발생!");
      }
    } catch (error) {
      console.error("❌ 아이 목록 불러오기 오류:", error);
      Alert.alert("서버 오류", "서버에 연결할 수 없습니다.");
    }
  };

  // 🔹 아이 삭제 함수 (백엔드 연결)
  const deleteChild = async (childId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("인증 오류", "로그인이 필요합니다.");
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(`${LOCAL_SERVER_URL}/child/deleteChild`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id: childId }), // 🔹 서버로 삭제할 아이 ID 전달
      });

      if (response.status === 204) { // 🔹 삭제 성공
        Alert.alert("삭제 완료", "아이 정보가 삭제되었습니다.");
        fetchChildren(); // 🔹 최신 목록을 다시 불러옴
      } else {
        const data = await response.json();
        Alert.alert("삭제 실패", data.message || "아이 삭제 중 오류 발생!");
      }
    } catch (error) {
      console.error("❌ 아이 삭제 오류:", error);
      Alert.alert("서버 오류", "서버에 연결할 수 없습니다.");
    }
  };

  // 🔹 아이 공유 코드 생성 함수
  const fetchChildCode = async (childId) => {
    try {
      let token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("인증 오류", "로그인이 필요합니다.");
        navigation.navigate("Login");
        return;
      }

      console.log("📌 저장된 토큰 확인:", token);

      const response = await fetch(`${LOCAL_SERVER_URL}/child/createChildToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id: childId }),
      });

      const data = await response.json();
      console.log("📌 Server Response:", data);

      if (response.ok) {
        setChildCode(data.token);
        setModalVisible(true);
      } else {
        Alert.alert("코드 생성 실패", data.message || "아이 코드 생성 오류!");
      }
    } catch (error) {
      console.error("❌ 아이 코드 생성 오류:", error);
      Alert.alert("서버 오류", "서버에 연결할 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchChildren();
  }, [route.params?.refresh]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white px-4`}>
      {/* 헤더 */}
      <View style={tw`flex-row justify-between items-center px-4 py-4 border-b`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold`}>HTP</Text>
        <View style={tw`flex-row items-center`}>
          <Ionicons name="notifications-outline" size={24} style={tw`mr-4`} />
          <Ionicons name="settings-outline" size={24} />
        </View>
      </View>

      {/* 아이 목록 */}
      <FlatList
        data={children}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={tw`m-4 p-4 border rounded-lg bg-white shadow-sm`}>
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <View style={tw`flex-row items-center`}>
                {item.profImgUrl ? (
                  <Image source={{ uri: item.profImgUrl }} style={tw`w-16 h-16 rounded-full mr-4`} />
                ) : (
                  <Ionicons name="person-circle-outline" size={64} color="gray" style={tw`mr-4`} />
                )}
                <View>
                  <Text style={tw`text-lg font-semibold`}>{item.name}</Text>
                </View>
              </View>

              {/* 아이 옵션 버튼 */}
              <TouchableOpacity onPress={() => setSelectedChild(item.id)}>
                <Ionicons name="ellipsis-vertical" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* 아이 옵션 메뉴 */}
            {selectedChild === item.id && (
              <View style={tw`absolute top-12 right-4 bg-white border rounded-lg p-2`}>
                <TouchableOpacity onPress={() => fetchChildCode(item.id)}>
                  <Text style={tw`p-2`}>아이 공유 코드 생성</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteChild(item.id)}>
                  <Text style={tw`p-2 text-red-500`}>아이 삭제</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedChild(null)}>
                  <Text style={tw`p-2 text-gray-500`}>닫기</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      {/* 공유 코드 모달 */}
      {modalVisible && (
        <Modal transparent={true}>
          <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50 px-6`}>
            <View style={tw`bg-white p-6 rounded-lg w-full max-w-sm`}>
              <Text style={tw`text-lg font-bold mb-2`}>아이 공유 코드:</Text>
              <Text style={tw`text-gray-800 text-center break-words`}>
                {childCode}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={tw`mt-4`}>
                <Text style={tw`text-blue-500 text-center`}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default ChildListScreen;
