import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,       // 추가
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

const ChildJournalListScreen = ({ navigation, route }) => {
  const { name } = route.params || {};

  // 탭 상태
  const [selectedTab, setSelectedTab] = useState("MY");

  // 일지 목록 로컬 상태
  const [journals, setJournals] = useState([]);

  // ───────────────────── 모달 상태 ─────────────────────
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);

  // 새 일지 추가
  const handleAddJournal = (title, content) => {
    const now = new Date();
    // 날짜 'dd.mm.yy'
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(2);
    const dateStr = `${day}.${month}.${year}`;

    const newJournal = {
      id: Date.now(),
      title,
      content,
      date: dateStr,
    };
    setJournals([newJournal, ...journals]);
  };

  // 일지 삭제
  const handleDeleteJournal = (id) => {
    setJournals((prev) => prev.filter((item) => item.id !== id));
  };

  // 모달 열기
  const openMenu = (journalItem) => {
    setSelectedJournal(journalItem);
    setMenuVisible(true);
  };

  // 모달 닫기
  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedJournal(null);
  };

  // "자세히 보기" 버튼
  const handleDetail = () => {
    if (selectedJournal) {
      navigation.navigate("JournalDetail", { item: selectedJournal });
    }
    closeMenu();
  };

  // "삭제하기" 버튼
  const handleDelete = () => {
    if (selectedJournal) {
      handleDeleteJournal(selectedJournal.id);
    }
    closeMenu();
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={[tw`flex-1`, { paddingTop: StatusBar.currentHeight || 0 }]}>
        
        {/* 헤더 */}
        <View style={tw`flex-row items-center justify-between px-4 py-3 border-b border-gray-200`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity
              style={tw`p-2 mr-2`}
              onPress={() => navigation.navigate("ChildCalendar", { name })}
            >
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text style={tw`text-xl font-bold`}>일지</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <Ionicons name="notifications-outline" size={24} style={tw`mr-4`} />
            <Ionicons name="settings-outline" size={24} />
          </View>
        </View>

        {/* 탭 (MY / 타 회원 일지) */}
        <View
          style={tw`flex-row items-center justify-center bg-gray-100 mx-auto mt-6 rounded-full w-2/3 border border-gray-300 p-1`}
        >
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

        {/* 일지 목록 */}
        <ScrollView style={tw`flex-1 px-4 py-4`}>
          {journals.length === 0 ? (
            <View style={tw`items-center justify-center mt-10`}>
              <Ionicons
                name="calendar-outline"
                size={60}
                color="gray"
                style={tw`mb-4`}
              />
              <Text style={tw`text-xl font-bold mb-2 text-center`}>
                일기가 텅 비었어요!
              </Text>
              <Text style={[
              tw`text-gray-600 text-center`,
              { lineHeight: 24 } // leading-relaxed 대신 인라인 스타일 사용
                ]}>
                {name || "00"}님의 일지를 작성해서{"\n"}
                사람들과 공유해 보세요
              </Text>
            </View>
          ) : (
            journals.map((item) => (
              <View
                key={item.id}
                style={tw`border border-gray-200 rounded-lg p-4 mb-3`}
              >
                <View style={tw`flex-row justify-between items-center mb-1`}>
                  <Text style={tw`text-sm text-gray-500`}>
                    {item.date}
                  </Text>
                  {/* 점 3개 → 메뉴 모달 열기 */}
                  <TouchableOpacity onPress={() => openMenu(item)}>
                    <Ionicons name="ellipsis-vertical" size={20} color="gray" />
                  </TouchableOpacity>
                </View>
                <Text style={tw`text-lg font-bold mb-1`}>{item.title}</Text>
                <Text style={tw`text-gray-700`} numberOfLines={2}>
                  {item.content}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* + 버튼 */}
        <TouchableOpacity
          style={[
            tw`absolute bg-black rounded-full items-center justify-center`,
            { width: 56, height: 56, bottom: 100, right: 20 },
          ]}
          onPress={() =>
            navigation.navigate("JournalWrite", {
              onSave: handleAddJournal,
            })
          }
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>

        {/* 하단 탭 */}
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

      {/*
        ───────────── 모달 (세로 버튼 2개) ─────────────
        배경을 반투명으로 깔고, 중앙에 흰색 박스를 띄움
      */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        {/* 반투명 배경 */}
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          {/* 흰색 박스 */}
          <View style={tw`bg-white w-3/4 rounded-md overflow-hidden`}>
            {/* 자세히 보기 버튼 */}
            <TouchableOpacity
              onPress={handleDetail}
              style={tw`p-4 border-b border-gray-200`}
            >
              <Text style={tw`text-base`}>자세히 보기</Text>
            </TouchableOpacity>
            {/* 삭제하기 버튼 */}
            <TouchableOpacity
              onPress={handleDelete}
              style={tw`p-4`}
            >
              <Text style={tw`text-base text-red-500`}>삭제하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ChildJournalListScreen;
