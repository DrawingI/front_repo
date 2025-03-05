import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
  Modal,
  Platform,
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

  // 🔹 한국 나이 계산 함수
 const calculateKoreanAge = (birthdate) => {
     if (!birthdate) return "알 수 없음";

     //
     let formattedBirthdate = birthdate;
     if (birthdate.includes("-")) {
       formattedBirthdate = birthdate.replace(/-/g, "").slice(2); // YYYY-MM-DD → YYMMDD 변환
     }

     if (formattedBirthdate.length !== 6) return "알 수 없음";

     const birthYearPrefix = formattedBirthdate.startsWith("0") ? 2000 : 1900;
     const birthYear = birthYearPrefix + parseInt(formattedBirthdate.substring(0, 2), 10);
     const currentYear = new Date().getFullYear();

     // 한국 나이 계산
     return `${(currentYear - birthYear) + 1}살`;
 };



  // 🔹 성별 변환 함수
  const convertGender = (gender) => {
    return gender === "female" ? "여자" : "남자";
  };


  // 🔹 아이 목록 불러오기
  const fetchChildren = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("인증 오류", "로그인이 필요합니다.");
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(
        `${LOCAL_SERVER_URL}/child/getAllChildrenByUser`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  // 🔹 아이 공유 코드 생성 함수
  const fetchChildCode = async (childId) => {
    try {
      let token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("인증 오류", "로그인이 필요합니다.");
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(`${LOCAL_SERVER_URL}/child/createChildToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id: childId }),
      });

      const data = await response.json();

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

  // 🔹 아이 삭제 확인 팝업 (웹 & 모바일 대응)
  const confirmDeleteChild = (childId) => {
    if (Platform.OS === "web") {
      const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
      if (isConfirmed) {
        deleteChild(childId);
      }
    } else {
      Alert.alert(
        "아이 삭제",
        "정말 삭제하시겠습니까?",
        [
          { text: "아니오", style: "cancel" },
          { text: "예", onPress: () => deleteChild(childId) },
        ],
        { cancelable: false }
      );
    }
  };

  // 🔹 아이 삭제 함수
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: childId }),
      });

      if (response.status === 204) {
        Alert.alert("삭제 완료", "아이 정보가 삭제되었습니다.");
        fetchChildren();
      } else {
        const data = await response.json();
        Alert.alert("삭제 실패", data.message || "아이 삭제 중 오류 발생!");
      }
    } catch (error) {
      console.error("❌ 아이 삭제 오류:", error);
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

      {/* ✅ 아이 등록하기 & 아이 불러오기 버튼  */}
      <View style={tw`flex-row justify-around py-3 border-b border-gray-200 bg-gray-100`}>
        <TouchableOpacity
          style={tw`flex-row items-center justify-center border border-gray-300 py-3 px-4 rounded-lg`}
          onPress={() => navigation.navigate("ChildRegister")}
        >
          <Ionicons name="person-add-outline" size={20} color="black" style={tw`mr-2`} />
          <Text style={tw`text-gray-700`}>아이 등록하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-row items-center justify-center border border-gray-300 py-3 px-4 rounded-lg`}
          onPress={() => navigation.navigate("ChildRetrieve")}
        >
          <Ionicons name="download-outline" size={20} color="black" style={tw`mr-2`} />
          <Text style={tw`text-gray-700`}>아이 불러오기</Text>
        </TouchableOpacity>
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
                  {/* ✅ 한국 나이 및 성별  */}
                  <Text style={tw`text-gray-500 text-sm`}>
                    {calculateKoreanAge(item.birthdate)} / {convertGender(item.gender)}
                  </Text>
                  <Text style={tw`text-lg font-semibold`}>{item.name}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => setSelectedChild(item.id)}>
                <Ionicons name="ellipsis-vertical" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* 검사 시작하기 버튼  */}
            <TouchableOpacity
              style={tw`bg-black py-3 rounded-lg`}
              onPress={() => navigation.navigate("TestScreen", { childId: item.id })}
            >
              <Text style={tw`text-white text-center text-lg`}>검사 시작하기</Text>
            </TouchableOpacity>

            {selectedChild === item.id && (
              <View style={tw`absolute top-12 right-4 bg-white border rounded-lg p-2`}>
                <TouchableOpacity onPress={() => fetchChildCode(item.id)}>
                  <Text style={tw`p-2`}>아이 공유 코드 생성</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDeleteChild(item.id)}>
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


  {/* 공유 코드 모달 정상 작동  */}
        {modalVisible && (
          <Modal transparent={true} visible={modalVisible} animationType="slide">
            <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50 px-6`}>
              <View style={tw`bg-white p-6 rounded-lg w-full max-w-sm`}>
                <Text style={tw`text-lg font-bold mb-2`}>아이 공유 코드:</Text>
                <Text style={tw`text-gray-800 text-center break-words`}>{childCode}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={tw`mt-4`}>
                  <Text style={tw`text-blue-500 text-center`}>닫기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

       {/* Bottom Navigation with Icons */}
                                  <View style={tw`flex-row justify-around py-3 border-t bg-white`}>
                                    <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate("TestHistory")}>
                                      <Ionicons name="document-text-outline" size={24} color="gray" />
                                      <Text style={tw`text-gray-500 text-xs mt-1`}>검사 기록</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={tw`items-center`}>
                                      <Ionicons name="home" size={24} color="black" />
                                      <Text style={tw`text-black font-bold text-xs mt-1`}>HTP</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate("Journal")}>
                                      <Ionicons name="calendar-outline" size={24} color="gray" />
                                      <Text style={tw`text-gray-500 text-xs mt-1`}>일지</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={tw`items-center`}>
                                      <Ionicons name="chatbubble-outline" size={24} color="gray" />
                                      <Text style={tw`text-gray-500 text-xs mt-1`}>소통</Text>
                                    </TouchableOpacity>
                                  </View>

      </SafeAreaView>
    );
};

export default ChildListScreen;
