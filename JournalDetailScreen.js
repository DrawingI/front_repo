import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar } from "react-native";
import tw from "tailwind-react-native-classnames";

const JournalDetailScreen = ({ navigation, route }) => {
  // ChildJournalListScreen에서 넘어온 일지 데이터
  const { item } = route.params || {};

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={[tw`flex-row justify-between items-center px-4 py-3 border-b border-gray-200`, 
        { paddingTop: StatusBar.currentHeight || 0 }]}>
        {/* 제목 (예: 병아리반 선생님) */}
        <Text style={tw`text-base font-bold`}>{item?.title || "상세 보기"}</Text>
        {/* 닫기 버튼 */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={tw`text-gray-500`}>닫기</Text>
        </TouchableOpacity>
      </View>

      {/* 내용 표시 */}
      <View style={tw`p-4`}>
        <Text style={tw`text-gray-700`}>{item?.content || ""}</Text>
      </View>
    </SafeAreaView>
  );
};

export default JournalDetailScreen;
