import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, StatusBar, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "tailwind-react-native-classnames";

const ChildListScreen = ({ navigation, route }) => {
  const [children, setChildren] = useState([]);

  // 한국 나이 계산 함수
  const calculateKoreanAge = (birthdate) => {
    if (!birthdate || birthdate.length !== 6) return "알 수 없음";

    const birthYearPrefix = birthdate.startsWith("0") ? 2000 : 1900;
    const birthYear = birthYearPrefix + parseInt(birthdate.substring(0, 2), 10);
    const currentYear = new Date().getFullYear();

    return `${currentYear - birthYear + 1}살`;
  };

  // AsyncStorage에서 아이 목록 불러오기 (앱 실행 시 한 번만 실행)
  useEffect(() => {
    const loadChildren = async () => {
      const storedChildren = await AsyncStorage.getItem("children");
      if (storedChildren) {
        setChildren(JSON.parse(storedChildren));
      }
    };
    loadChildren();
  }, []);

  // 새로운 아이 추가
  const addNewChild = async (newChild) => {
    const updatedChildren = [...children, newChild];
    setChildren(updatedChildren);
    await AsyncStorage.setItem("children", JSON.stringify(updatedChildren));
  };

  // useEffect 대신 직접 실행
  useEffect(() => {
    if (route.params?.newChild) {
      addNewChild(route.params.newChild);
    }
  }, [route.params?.newChild]);

  // 아이 삭제 기능
  const deleteChild = async (index) => {
    Alert.alert("삭제 확인", "정말 이 아이를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: async () => {
          const updatedChildren = children.filter((_, i) => i !== index);
          setChildren(updatedChildren);
          await AsyncStorage.setItem("children", JSON.stringify(updatedChildren));
        },
      },
    ]);
  };

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
          <TouchableOpacity
            style={tw`flex-1 flex-row items-center justify-center border border-gray-300 py-3 rounded-lg mr-2`}
            onPress={() => navigation.navigate("ChildRegister")}
          >
            <Ionicons name="person-add-outline" size={20} color="black" style={tw`mr-2`} />
            <Text style={tw`text-gray-700`}>아이 등록하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`flex-1 flex-row items-center justify-center border border-gray-300 py-3 rounded-lg ml-2`}>
            <Ionicons name="download-outline" size={20} color="black" style={tw`mr-2`} />
            <Text style={tw`text-gray-700`}>아이 불러오기</Text>
          </TouchableOpacity>
        </View>

        {/* 아이 목록 */}
        <FlatList
          data={children}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={tw`m-4 p-4 border rounded-lg bg-white shadow-sm flex-row justify-between items-center`}>
              {/* 아이 정보 */}
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
              <TouchableOpacity onPress={() => deleteChild(index)}>
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

        {/* Bottom Navigation */}
        <View style={tw`flex-row justify-around py-3 border-t bg-white`}>
          <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate("TestHistory")}>
            <Ionicons name="document-text-outline" size={24} color="gray" />
            <Text style={tw`text-gray-500 text-xs mt-1`}>검사 기록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`items-center`}>
            <Ionicons name="home" size={24} color="black" />
            <Text style={tw`text-black font-bold text-xs mt-1`}>HTP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`items-center`}>
            <Ionicons name="calendar-outline" size={24} color="gray" />
            <Text style={tw`text-gray-500 text-xs mt-1`}>일지</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`items-center`}>
            <Ionicons name="chatbubble-outline" size={24} color="gray" />
            <Text style={tw`text-gray-500 text-xs mt-1`}>소통</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChildListScreen;
