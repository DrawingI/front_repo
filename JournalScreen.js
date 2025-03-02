import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

const JournalScreen = ({ navigation }) => {
  // 예시 데이터
  const childrenData = [
    { id: 1, age: 8, gender: "여자", name: "김가연", image: null },
    { id: 2, age: 10, gender: "남자", name: "이천수", image: null },
    { id: 3, age: 7, gender: "남자", name: "박이습", image: null },
    { id: 4, age: 9, gender: "여자", name: "노선영", image: null },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* 상태바 높이 고려 (안드로이드) */}
      <View style={[tw`flex-1`, { paddingTop: StatusBar.currentHeight || 0 }]}>
        
        {/* Header */}
        <View style={tw`flex-row justify-between items-center px-4 py-3 border-b border-gray-200`}>
          <Text style={tw`text-xl font-bold`}>일지</Text>
          <View style={tw`flex-row items-center`}>
            <Ionicons name="notifications-outline" size={24} style={tw`mr-4`} />
            <Ionicons name="settings-outline" size={24} />
          </View>
        </View>

        {/* 아이 목록 (카드 형태) */}
        <ScrollView style={tw`flex-1 px-4 py-2`}>
          {childrenData.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={tw`flex-row items-center bg-white rounded-lg p-4 mb-3 border border-gray-200`}
              onPress={() => {
                // 상세 화면 이동 등 필요 시 추가
                navigation.navigate("ChildCalendar", { name: child.name });
              }}
            >
              {/* 프로필 이미지 or 기본 아이콘 */}
              <View style={tw`w-12 h-12 rounded-full bg-gray-300 justify-center items-center mr-4`}>
                {child.image ? (
                  <Image
                    source={child.image}
                    style={tw`w-12 h-12 rounded-full`}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={28} color="white" />
                )}
              </View>

              {/* 아이 정보 (두 줄) */}
              <View style={tw`flex-1`}>
                <Text style={tw`text-sm text-gray-500`}>
                  {child.age}살 / {child.gender}
                </Text>
                <Text style={tw`text-base font-semibold mt-1`}>
                  {child.name}
                </Text>
              </View>

              {/* 오른쪽 화살표 아이콘 */}
              <Ionicons name="chevron-forward" size={24} color="gray" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={tw`flex-row justify-around py-3 border-t bg-white`}>
          <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate("TestHistory")}>
            <Ionicons name="document-text-outline" size={24} color="gray" />
            <Text style={tw`text-gray-500 text-xs mt-1`}>검사 기록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`items-center`} onPress={() => navigation.navigate("ChildList")}>
            <Ionicons name="home-outline" size={24} color="gray" />
            <Text style={tw`text-gray-500 text-xs mt-1`}>HTP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`items-center`}>
            <Ionicons name="calendar-outline" size={24} color="black" />
            <Text style={tw`text-black font-bold text-xs mt-1`}>일지</Text>
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

export default JournalScreen;
