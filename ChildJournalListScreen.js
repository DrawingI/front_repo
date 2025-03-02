import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

const ChildJournalListScreen = ({ navigation, route }) => {
  // ChildCalendarScreen에서 넘어온 아이 이름
  const { name } = route.params || {};

  // 상단 탭 선택 상태
  const [selectedTab, setSelectedTab] = useState("MY");

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={[tw`flex-1`, { paddingTop: StatusBar.currentHeight || 0 }]}>
        
        {/* ───────────── 헤더 영역 ───────────── */}
        <View style={tw`flex-row items-center justify-between px-4 py-3 border-b border-gray-200`}>
          {/* 왼쪽: 뒤로가기 버튼 + 타이틀 */}
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity
              style={tw`p-2 mr-2`}
              onPress={() => navigation.navigate("ChildCalendar", { name })}
            >
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text style={tw`text-xl font-bold`}>일지</Text>
          </View>
          {/* 오른쪽: 알림/설정 아이콘 */}
          <View style={tw`flex-row items-center`}>
            <Ionicons name="notifications-outline" size={24} style={tw`mr-4`} />
            <Ionicons name="settings-outline" size={24} />
          </View>
        </View>

        {/*
          ───────────── MY / 타 회원 일지 탭 (세그먼트) ─────────────
          - w-2/3 로 가로 폭 제한
          - p-1 로 내부 패딩
          - border border-gray-300 + rounded-full 로 회색 테두리와 둥근 모서리
        */}
        <View
          style={tw`flex-row items-center justify-center bg-gray-100 mx-auto mt-10 rounded-full w-2/3 border border-gray-300 p-1`}
        >
          {/* MY 탭 */}
          <TouchableOpacity
            style={[
              tw`flex-1 items-center justify-center py-2 rounded-full`,
              selectedTab === "MY" ? tw`bg-white` : tw`bg-transparent`,
            ]}
            onPress={() => setSelectedTab("MY")}
          >
            <Text
              style={[
                tw`text-base font-semibold`,
                selectedTab === "MY" ? tw`text-black` : tw`text-gray-500`,
              ]}
            >
              MY
            </Text>
          </TouchableOpacity>
          {/* 타 회원 일지 탭 */}
          <TouchableOpacity
            style={[
              tw`flex-1 items-center justify-center py-2 rounded-full`,
              selectedTab === "others" ? tw`bg-white` : tw`bg-transparent`,
            ]}
            onPress={() => setSelectedTab("others")}
          >
            <Text
              style={[
                tw`text-base font-semibold`,
                selectedTab === "others" ? tw`text-black` : tw`text-gray-500`,
              ]}
            >
              타 회원 일지
            </Text>
          </TouchableOpacity>
        </View>

        {/* ───────────── 스크롤 영역 ───────────── */}
        <ScrollView
          contentContainerStyle={tw`flex-grow items-center justify-center px-6 py-4`}
        >
          {/* 중앙 아이콘/메시지 */}
          <Ionicons
            name="calendar-outline"
            size={60}
            color="gray"
            style={tw`mb-4`}
          />
          <Text style={tw`text-xl font-bold mb-2 text-center`}>
            일기가 텅 비었어요!
          </Text>
          <Text
            style={[
              tw`text-gray-600 text-center`,
              { lineHeight: 24 }, // 줄 간격
            ]}
          >
            {name || "00"}님의 일지를 작성해서{"\n"}
            사람들과 공유해 보세요
          </Text>
        </ScrollView>

        {/* ───────────── 플로팅 + 버튼 ───────────── */}
        <TouchableOpacity
          style={[
            tw`absolute bg-black rounded-full items-center justify-center`,
            { width: 56, height: 56, bottom: 100, right: 20 },
          ]}
          onPress={() => navigation.navigate("JournalWrite")}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>

        {/* ───────────── 하단 네비게이션 바 ───────────── */}
        <View style={tw`flex-row justify-around py-3 border-t bg-white`}>
          <TouchableOpacity
            style={tw`items-center`}
            onPress={() => navigation.navigate("TestHistory")}
          >
            <Ionicons name="document-text-outline" size={24} color="gray" />
            <Text style={tw`text-gray-500 text-xs mt-1`}>검사 기록</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`items-center`}
            onPress={() => navigation.navigate("ChildList")}
          >
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

export default ChildJournalListScreen;
