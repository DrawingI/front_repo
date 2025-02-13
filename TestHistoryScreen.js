import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

const TestHistoryScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Android 상태바 높이 고려 */}
      <View style={[tw`flex-1`, { paddingTop: StatusBar.currentHeight || 20 }]}>
        
        {/* Header */}
        <View style={tw`flex-row justify-between items-center px-6 py-4 border-b`}>
          <Text style={tw`text-xl font-bold`}>검사 기록</Text>
          <View style={tw`flex-row items-center`}>
            <Ionicons name="notifications-outline" size={24} style={tw`mr-4`} />
            <Ionicons name="settings-outline" size={24} />
          </View>
        </View>

        {/* Info Toggle */}
        <View style={tw`px-6 py-3`}>
          <TouchableOpacity style={tw`flex-row border border-gray-300 rounded-lg py-3 px-4`}>
            <Ionicons name="download-outline" size={20} color="gray" style={tw`mr-2`} />
            <Text style={tw`text-gray-700`}>아이 불러오기</Text>
          </TouchableOpacity>
        </View>

        {/* Centered Message */}
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-gray-500 text-lg`}>등록된 아이가 없습니다</Text>
        </View>

        {/* Bottom Navigation with Icons */}
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
