import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// 🔹 로컬 네트워크 서버 주소 (PC의 로컬 IP 주소 사용)
const LOCAL_SERVER_URL = 'http://172.30.1.94:5000';

const SignUpScreen = ({ navigation }) => {
  const [isParent, setIsParent] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // 🔹 로딩 상태 추가

  // 🔹 갤러리에서 이미지 선택
  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // 🔹 계정 만들기 버튼 클릭 시 API 요청
  const handleSignUp = async () => {
    if (!nickname || !email || !password || !confirmPassword) {
      Alert.alert('입력 오류', '모든 정보를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('비밀번호 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true); // 🔹 로딩 시작

    try {
      const response = await fetch(`${LOCAL_SERVER_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname,
          email,
          password,
          role: isParent ? 'parent' : 'teacher',
        }),
      });

      const data = await response.json();
      setLoading(false); // 🔹 로딩 종료

      if (response.ok) {
        Alert.alert('회원가입 성공!', '로그인 화면으로 이동합니다.', [
          {
            text: '확인',
            onPress: () => navigation.navigate('LoginScreen'), // 🔹 회원가입 후 로그인 화면으로 이동
          },
        ]);
      } else {
        Alert.alert('회원가입 실패', data.message || '다시 시도해주세요.');
      }
    } catch (error) {
      setLoading(false); // 🔹 로딩 종료
      Alert.alert('서버 오류', '서버에 연결할 수 없습니다.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={[tw`flex-grow bg-white px-6`, { paddingBottom: 30 }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 }}>
            {/* Profile Image */}
            <View style={tw`items-center mb-6`}>
              <View style={tw`w-32 h-32 rounded-full bg-gray-200 justify-center items-center overflow-hidden`}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={tw`w-full h-full`} resizeMode="cover" />
                ) : (
                  <Ionicons name="person-outline" size={64} color="gray" />
                )}
              </View>
              <TouchableOpacity
                style={tw`absolute bottom-0 right-20 bg-white p-2 rounded-full border border-gray-300`}
                onPress={handleSelectImage}
              >
                <Ionicons name="camera-outline" size={20} color="black" />
              </TouchableOpacity>
            </View>

            {/* Tab Selector */}
            <View style={tw`flex-row mb-6`}>
              <TouchableOpacity
                style={[tw`flex-1 py-3 rounded-lg items-center`, isParent ? { backgroundColor: '#F97316' } : tw`bg-gray-100`]}
                onPress={() => setIsParent(true)}
              >
                <Text style={[tw`text-lg`, isParent ? tw`text-white` : tw`text-gray-500`]}>부모님</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[tw`flex-1 py-3 rounded-lg items-center`, !isParent ? { backgroundColor: '#F97316' } : tw`bg-gray-100`]}
                onPress={() => setIsParent(false)}
              >
                <Text style={[tw`text-lg`, !isParent ? tw`text-white` : tw`text-gray-500`]}>선생님</Text>
              </TouchableOpacity>
            </View>

            {/* Input Fields */}
            <TextInput style={tw`w-full p-4 text-lg bg-gray-100 rounded-lg mb-3`} placeholder="닉네임" value={nickname} onChangeText={setNickname} />
            <TextInput style={tw`w-full p-4 text-lg bg-gray-100 rounded-lg mb-3`} placeholder="이메일" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput style={tw`w-full p-4 text-lg bg-gray-100 rounded-lg mb-3`} placeholder="비밀번호" secureTextEntry value={password} onChangeText={setPassword} />
            <TextInput style={tw`w-full p-4 text-lg bg-gray-100 rounded-lg mb-6`} placeholder="비밀번호 확인" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

            {/* Sign-Up Button */}
            <TouchableOpacity
              style={[
                tw`w-full py-4 rounded-lg`,
                nickname && email && password && confirmPassword ? { backgroundColor: '#F97316' } : tw`bg-gray-300`,
              ]}
              onPress={handleSignUp}
              disabled={loading || !nickname || !email || !password || !confirmPassword}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={tw`text-center text-lg text-white`}>계정 만들기</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
