import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useIsFocused } from "@react-navigation/native"; 

const LOCAL_SERVER_URL = "http://localhost:5000"; // 실제 서버 주소로 변경 필요

const CommunicationScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [children, setChildren] = useState([]);
  const isFocused = useIsFocused();  // 현재 화면 감지

  // HTP 클릭 시 이동
  const handleHTPNavigation = () => {
    navigation.replace("ChildList"); // HTP 화면을 강제로 새로고침하며 이동
  };

  // 아이 목록 불러오기
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
        headers: { Authorization: `Bearer ${token}` },
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

  // useFocusEffect: 화면이 다시 포커스될 때 상태를 업데이트
  useFocusEffect(
    React.useCallback(() => {
      fetchChildren(); // 최신 아이 목록 불러오기
    }, [])
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* 상단 헤더 */}
      <View style={tw`flex-row justify-between items-center px-4 py-4`}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
           <Ionicons name="arrow-back" size={24} color="black" />
         </TouchableOpacity>
        <Text style={tw`text-2xl font-bold`}>소통</Text>
        <View style={tw`flex-row items-center`}>
          <Ionicons name="notifications-outline" size={24} style={tw`mr-4`} />
          <Ionicons name="settings-outline" size={24} />
        </View>
      </View>

      {/* 메인 컨텐츠 */}
      <View style={tw`flex-1 justify-center items-center`}>
        <Ionicons name="people-outline" size={80} color="gray" />
        <Text style={tw`text-lg font-bold mt-4`}>지인들과 채팅해 보실래요?</Text>
        <Text style={tw`text-gray-500 mt-2 text-center`}>
          아이 정보를 공유하는 사람들과 {"\n"} 네트워킹 해보세요
        </Text>
      </View>

      {/* 채팅 추가 버튼 */}
      <TouchableOpacity
        style={tw`absolute bottom-24 right-6 bg-black w-12 h-12 rounded-full items-center justify-center shadow-lg`}
        onPress={() => {
          setModalVisible(true);
          fetchChildren(); // 최신 목록 불러오기
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* 아이 목록 표시 */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50 px-6`}>
          <View style={tw`bg-white p-6 rounded-lg w-full max-w-sm`}>
            <Text style={tw`text-lg font-bold mb-2`}>아이 채팅방 만들기</Text>

            <FlatList
                    data={children}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={tw`flex-row justify-between items-center p-3 border-b`}
                        onPress={() => {
                          setModalVisible(false);
                          navigation.navigate("MemberSelection", { child: item });
                        }}
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
                              {item.age} / {item.gender === "female" ? "여자" : "남자"}
                            </Text>
                          </View>
                        </View>
                        {/* > 버튼 */}
                        <Ionicons name="chevron-forward" size={24} color="gray" />
                      </TouchableOpacity>
                    )}
                  />

            {/* 닫기 버튼 */}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={tw`mt-4`}>
              <Text style={tw`text-blue-500 text-center`}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 하단 네비게이션 바 */}
      <View style={tw`flex-row justify-around py-3 border-t bg-white`}>
        {/* 검사 기록 버튼 */}
        <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate("TestHistory")}>
          <Ionicons name="document-text-outline" size={24} color={isFocused ? "gray" : "black"} />
          <Text style={tw`${isFocused ? "text-gray-500" : "text-black font-bold"} text-xs mt-1`}>
            검사 기록
          </Text>
        </TouchableOpacity>

        {/* HTP 버튼 */}
        <TouchableOpacity style={tw`items-center`} onPress={handleHTPNavigation}>
          <Ionicons name="home" size={24} color={isFocused ? "gray" : "black"} />
          <Text style={tw`${isFocused ? "text-gray-500" : "text-black font-bold"} text-xs mt-1`}>
            HTP
          </Text>
        </TouchableOpacity>

        {/* 일지 버튼 */}
        <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate("Journal")}>
          <Ionicons name="calendar-outline" size={24} color={isFocused ? "gray" : "black"} />
          <Text style={tw`${isFocused ? "text-gray-500" : "text-black font-bold"} text-xs mt-1`}>
            일지
          </Text>
        </TouchableOpacity>

        {/* 소통 버튼 */}
        <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate("Communication")}>
          <Ionicons name="chatbubble" size={24} color={isFocused ? "black" : "gray"} />
          <Text style={tw`${isFocused ? "text-black font-bold" : "text-gray-500"} text-xs mt-1`}>
            소통
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default CommunicationScreen;
