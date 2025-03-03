import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

const JournalWriteScreen = ({ navigation, route }) => {
  // ChildJournalListScreen에서 넘겨준 onSave 콜백
  const { onSave } = route.params || {};

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

  // 갤러리에서 이미지 선택
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('갤러리 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  // 카메라로 사진 촬영
  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('카메라 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  // 이미지 삭제
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // 완료 버튼
  const handleSubmit = () => {
    // ChildJournalListScreen에서 받은 onSave 콜백이 있으면 호출
    if (onSave) {
      onSave(title, content);
      // 현재 예시에서는 images는 넘기지 않았지만
      // 필요하다면 onSave(title, content, images) 형태로 전달 가능
    }
    navigation.goBack();
  };

  // 취소 버튼
  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* 안드로이드 상태바 높이 고려 */}
      <View style={{ paddingTop: StatusBar.currentHeight || 0 }}>
        {/* 헤더 */}
        <View style={tw`flex-row items-center justify-between px-4 py-3 border-b border-gray-200`}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={tw`text-gray-500`}>취소</Text>
          </TouchableOpacity>
          <Text style={tw`text-base font-bold`}>일지 작성</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={tw`text-black`}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 스크롤 가능한 영역 */}
      <ScrollView contentContainerStyle={tw`px-4 pt-4 pb-24`}>
        {/* 제목 입력 */}
        <TextInput
          style={[tw`border border-gray-200 rounded-md p-3 mb-3`, { height: 50 }]}
          placeholder="제목을 작성해주세요"
          value={title}
          onChangeText={setTitle}
        />

        {/* 내용 입력 (높이 확대, 최대 400자) */}
        <TextInput
          style={[
            tw`border border-gray-200 rounded-md p-3 mb-1`,
            { minHeight: 200 },
          ]}
          placeholder="글을 작성해주세요"
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={400}
        />
        <Text style={tw`text-right text-gray-400 mb-3`}>
          {content.length}/400
        </Text>

        {/* 이미지/카메라 버튼 */}
        <View style={tw`flex-row mb-4`}>
          <TouchableOpacity
            style={[
              tw`border border-gray-300 rounded-md px-4 py-2 mr-2 flex-row items-center`,
            ]}
            onPress={handlePickImage}
          >
            <Ionicons name="image-outline" size={20} color="gray" style={tw`mr-2`} />
            <Text>이미지</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              tw`border border-gray-300 rounded-md px-4 py-2 flex-row items-center`,
            ]}
            onPress={handleOpenCamera}
          >
            <Ionicons name="camera-outline" size={20} color="gray" style={tw`mr-2`} />
            <Text>카메라</Text>
          </TouchableOpacity>
        </View>

        {/* 선택된 이미지 목록 표시 (예: 50% 정사각형 + X 버튼) */}
        {images.map((uri, index) => (
          <View key={index} style={tw`relative mb-3 items-center`}>
            <Image
              source={{ uri }}
              style={[
                tw`rounded`,
                {
                  width: '50%',     // 화면의 50% 너비
                  aspectRatio: 1,   // 정사각형
                },
              ]}
              resizeMode="cover"
            />
            {/* X 버튼 (이미지 오른쪽 위) */}
            <TouchableOpacity
              style={tw`absolute top-2 right-2 bg-black rounded-full p-1`}
              onPress={() => handleRemoveImage(index)}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default JournalWriteScreen;
