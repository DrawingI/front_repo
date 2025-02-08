import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const LoginScreen = () => {
  console.log("LoginScreen이 렌더링되었습니다!");

  return (
    <View style={tw`flex-1 bg-white items-center justify-center px-6`}>
      {/* 앱 제목 */}
      <Text style={tw`text-4xl font-bold text-orange-500 mb-2`}>Drawing i</Text>
      <Text style={tw`text-lg text-gray-500 mb-10`}>아이의 마음을 이해하는 창</Text>

      {/* Google 로그인 버튼 */}
      <TouchableOpacity style={tw`flex-row border border-gray-300 rounded-lg w-full py-4 px-4 items-center mb-4`}>
        <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} style={tw`w-6 h-6 mr-3`} />
        <Text style={tw`text-lg text-black`}>Google로 시작하기</Text>
      </TouchableOpacity>

      {/* 또는 구분선 */}
      <View style={tw`flex-row items-center w-full mb-4`}>
        <View style={tw`flex-1 h-0.5 bg-gray-300`} />
        <Text style={tw`mx-3 text-gray-400`}>또는</Text>
        <View style={tw`flex-1 h-0.5 bg-gray-300`} />
      </View>

      {/* 이메일 입력 */}
      <TextInput style={tw`w-full p-4 text-lg bg-gray-100 rounded-lg mb-3`} placeholder="이메일을 입력해주세요" />

      {/* 비밀번호 입력 */}
      <TextInput style={tw`w-full p-4 text-lg bg-gray-100 rounded-lg mb-6`} placeholder="비밀번호를 입력해주세요" secureTextEntry />

      {/* 로그인 버튼 */}
      <TouchableOpacity style={tw`bg-black w-full py-4 rounded-lg mb-4`}>
        <Text style={tw`text-white text-lg font-bold text-center`}>로그인</Text>
      </TouchableOpacity>

      {/* 하단 링크 */}
      <View style={tw`flex-row mb-6`}>
        <TouchableOpacity>
          <Text style={tw`text-black font-bold mr-6`}>회원 가입</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={tw`text-gray-500 mr-6`}>이메일 찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={tw`text-gray-500`}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
