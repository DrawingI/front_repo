import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

const TestHistoryScreen = ({ navigation }) => {
  const [children, setChildren] = useState([]);

  // 한국 나이 계산 함수
  const calculateKoreanAge = (birthdate) => {
    if (!birthdate || birthdate.length !== 6) return "알 수 없음";

    const birthYearPrefix = parseInt(birthdate.substring(0, 2), 10) <= new Date().getFullYear() % 100 ? 2000 : 1900;
    const birthYear = birthYearPrefix + parseInt(birthdate.substring(0, 2), 10);
    const currentYear = new Date().getFullYear();

    return `${currentYear - birthYear + 1}살`; // 한국식 나이 계산
  };

  // AsyncStorage에서 아이 목록 불러오기
  useEffect(() => {
    const loadChildren = async () => {
      const storedChildren = await AsyncStorage.getItem("children");
      if (storedChildren) {
        setChildren(JSON.parse(storedChildren));
      }
    };
    loadChildren();
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={[tw`flex-1`, { paddingTop: StatusBar.currentHeight || 20 }]}>

        {/* Header */}
        <View style={tw`flex-row justify-between items-center px-6 py-4 border-b`}>
          <Text style={tw`text-xl font-bold`}>검사 기록</Text>
          <View style={tw`flex-row items-center`}>
            <Ionicons name="notifications-outline" size={24} style={tw`mr-4`} />
            <Ionicons name="settings-outline" size={24} />
          </View>
        </View>

        {/* 아이 불러오기 버튼 */}
        <View style={tw`px-6 py-3`}>
          <TouchableOpacity style={tw`flex-row border border-gray-300 rounded-lg py-3 px-4`}>
            <Ionicons name="download-outline" size={20} color="gray" style={tw`mr-2`} />
            <Text style={tw`text-gray-700`}>아이 불러오기</Text>
          </TouchableOpacity>
        </View>

        {/* 아이 목록 */}
        <FlatList
          data={children}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={tw`m-4 p-4 border rounded-lg bg-white shadow-sm flex-row justify-between items-center`}>
              {/* 프로필 사진 및 아이 정보 */}
              <View style={tw`flex-row items-center`}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={tw`w-12 h-12 rounded-full mr-4`} />
                ) : (
                  <Ionicons name="person-circle-outline" size={48} color="gray" style={tw`mr-4`} />
                )}
                <View>
                  <Text style={tw`text-sm text-gray-500`}>
                    {calculateKoreanAge(item.birthdate)} / {item.gender}
                  </Text>
                  <Text style={tw`text-lg font-semibold`}>{item.name}</Text>
                </View>
              </View>

              {/* 기록 보기 버튼 */}
              <TouchableOpacity style={[tw`border py-2 px-4 rounded-lg`, { borderColor: "orange" }]}>
                <Text style={[tw`text-sm`, { color: "orange" }]}>기록보기</Text>
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
          <TouchableOpacity style={tw`items-center`}>
            <Ionicons name="document-text-outline" size={24} color="black" />
            <Text style={tw`text-black font-bold text-xs mt-1`}>검사 기록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate("ChildList")}>
            <Ionicons name="home-outline" size={24} color="gray" />
            <Text style={tw`text-gray-500 text-xs mt-1`}>HTP</Text>
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

export default TestHistoryScreen;
