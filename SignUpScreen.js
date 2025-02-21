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
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const SignUpScreen = ({ navigation }) => {
  const [isParent, setIsParent] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 갤러리에서 이미지 선택
  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('갤러리 접근 권한이 필요합니다!');
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

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 계정 만들기 버튼 클릭 핸들러
  const handleSignUp = () => {
    if (!nickname || !email || !password || !confirmPassword) {
      Alert.alert('경고', '모든 정보를 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('경고', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('경고', '비밀번호가 일치하지 않습니다.');
      return;
    }

    navigation.navigate('ChildList');
  };

  // 버튼 활성화 여부
  const isFormComplete = nickname && email && password && confirmPassword;

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
          <View
            style={{
              paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
            }}
          >
            {/* Profile Image */}
            <View style={tw`items-center mb-6`}>
              <View
                style={tw`w-32 h-32 rounded-full bg-gray-200 justify-center items-center overflow-hidden`}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={tw`w-full h-full`}
                    resizeMode="cover"
                  />
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
                style={[
                  tw`flex-1 py-3 rounded-lg items-center`,
                  isParent
                    ? { backgroundColor: '#F97316' }
                    : tw`bg-gray-100`,
                ]}
                onPress={() => setIsParent(true)}
              >
                <Text
                  style={[
                    tw`text-lg`,
                    isParent ? tw`text-white` : tw`text-gray-500`,
                  ]}
                >
                  부모님
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  tw`flex-1 py-3 rounded-lg items-center`,
                  !isParent
                    ? { backgroundColor: '#F97316' }
                    : tw`bg-gray-100`,
                ]}
                onPress={() => setIsParent(false)}
              >
                <Text
                  style={[
                    tw`text-lg`,
                    !isParent ? tw`text-white` : tw`text-gray-500`,
                  ]}
                >
                  선생님
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Fields with Labels */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-black font-bold mb-1`}>닉네임</Text>
              <TextInput
                style={tw`w-full p-4 text-lg bg-gray-100 rounded-lg`}
                placeholder="(3-15자 영문/숫자 조합)"
                value={nickname}
                onChangeText={setNickname}
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-black font-bold mb-1`}>이메일</Text>
              <TextInput
                style={tw`w-full p-4 text-lg bg-gray-100 rounded-lg`}
                placeholder="이메일을 입력해주세요"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-black font-bold mb-1`}>비밀번호</Text>
              <TextInput
                style={tw`w-full p-4 text-lg bg-gray-100 rounded-lg`}
                placeholder="비밀번호를 입력해주세요"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={tw`mb-6`}>
              <Text style={tw`text-black font-bold mb-1`}>비밀번호 확인</Text>
              <TextInput
                style={tw`w-full p-4 text-lg bg-gray-100 rounded-lg`}
                placeholder="비밀번호를 확인해주세요"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* Sign-Up Button */}
            <TouchableOpacity
              style={[
                tw`w-full py-4 rounded-lg`,
                isFormComplete ? { backgroundColor: '#F97316' } : tw`bg-gray-300`,
              ]}
              onPress={handleSignUp}
              disabled={!isFormComplete}
            >
              <Text style={tw`text-center text-lg text-white`}>계정 만들기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
