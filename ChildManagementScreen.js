import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';

const ChildManagementScreen = () => {
  return (
    <SafeAreaView style={[tw`flex-1 bg-white`, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 }]}>
      {/* 상단 바 */}
      <View style={tw`flex-row justify-between items-center px-6 py-6`}>
        <Text style={tw`text-2xl font-bold`}>아이 관리</Text>
        <View style={tw`flex-row items-center`}>
          <Ionicons name="notifications-outline" size={24} color="black" style={tw`mr-4`} />
          <Ionicons name="settings-outline" size={24} color="black" />
        </View>
      </View>

      {/* 아이 등록 및 불러오기 */}
      <View style={tw`flex-row justify-between px-6 mt-4`}>
        <TouchableOpacity style={tw`flex-1 bg-gray-100 rounded-lg p-8 mr-2 items-center`}>
          <Ionicons name="add-circle" size={40} color="#F97316" />
          <Text style={tw`mt-2 text-xl`}>아이 등록</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-1 bg-gray-100 rounded-lg p-8 ml-2 items-center`}>
          <Ionicons name="search" size={40} color="#F97316" />
          <Text style={tw`mt-2 text-xl`}>아이 불러오기</Text>
        </TouchableOpacity>
      </View>

      {/* 등록된 아이 없음 */}
      <View style={tw`flex-1 justify-center items-center`}>
        <View style={tw`w-24 h-28 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center`}>
          <Ionicons name="image-outline" size={36} color="gray" />
        </View>
        <Text style={tw`text-gray-500 mt-2 text-lg`}>등록된 아이가 없어요</Text>
      </View>
    </SafeAreaView>
  );
};

export default ChildManagementScreen;
