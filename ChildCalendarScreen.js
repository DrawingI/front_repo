import React, { useState, useEffect } from "react";
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

const ChildCalendarScreen = ({ navigation, route }) => {
  // JournalScreen에서 넘어온 아이 이름
  const { name } = route.params || {};

  // 오늘 날짜
  const today = new Date();

  // 현재 표시 중인 달 (기본값: 오늘이 속한 달)
  const [displayDate, setDisplayDate] = useState(new Date());

  // 선택된 날짜 (기본값: 오늘 날짜)
  const [selectedDate, setSelectedDate] = useState(today);

  // 연, 월, 올해 여부
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth(); // 0-based (0=1월)
  const currentYear = today.getFullYear();

  // 올해면 "3월", 아니면 "2024년 3월" 형식으로 표시
  const isThisYear = year === currentYear;
  const monthLabel = isThisYear
    ? `${month + 1}월`
    : `${year}년 ${month + 1}월`;

  // 이전 달로 이동
  const goToPrevMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11; // 12월
      newYear -= 1;
    }
    setDisplayDate(new Date(newYear, newMonth, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 11) {
      newMonth = 0; // 1월
      newYear += 1;
    }
    setDisplayDate(new Date(newYear, newMonth, 1));
  };

  /**
   * 달력에 표시할 날짜 목록 생성
   * - 이전 달 일부, 다음 달 일부 포함 (총 6주=최대 42칸)
   */
  const generateCalendarDates = () => {
    // 이번 달 1일, 이번 달 마지막 날
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate(); // 이번 달 총 일 수

    // 첫 주에 필요한 이전 달 날짜 수 (일요일=0, 월=1, ... 토=6)
    const startDay = firstDayOfMonth.getDay();
    // 마지막 주에 필요한 다음 달 날짜 수
    const endDay = lastDayOfMonth.getDay();

    const calendar = [];

    // 1) 이전 달 날짜 채우기
    for (let i = 0; i < startDay; i++) {
      const prevMonthLastDate = new Date(year, month, 0).getDate(); 
      const date = prevMonthLastDate - (startDay - 1) + i;
      calendar.push({
        value: date,
        inCurrentMonth: false,
      });
    }

    // 2) 이번 달 날짜 채우기
    for (let i = 1; i <= totalDaysInMonth; i++) {
      calendar.push({
        value: i,
        inCurrentMonth: true,
      });
    }

    // 3) 다음 달 날짜 채우기
    for (let i = endDay + 1; i <= 6; i++) {
      const date = i - endDay;
      calendar.push({
        value: date,
        inCurrentMonth: false,
      });
    }

    return calendar;
  };

  const calendarDates = generateCalendarDates();

  // 요일 헤더
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // 날짜 선택 함수
  const handleSelectDay = (dayValue, inCurrentMonth) => {
    if (!inCurrentMonth) return; // 다른 달(회색 날짜)은 선택 불가. 필요 시 로직 수정 가능
    // 선택된 날짜를 displayDate의 연/월/일로 설정
    setSelectedDate(new Date(year, month, dayValue));
  };

  // displayDate가 바뀌면, 선택된 날짜가 현재 달 범위를 벗어났을 경우 처리
  // 예: 3월 31일 선택 상태에서 2월로 이동하면, 2월은 28일까지 있으므로 선택 날짜 조정
  useEffect(() => {
    const lastDayOfNewMonth = new Date(year, month + 1, 0).getDate();
    const selectedDay = selectedDate.getDate();
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    // 만약 이미 선택된 날짜가 현재 달과 달라졌다면
    // (또는 이번 달 일수보다 클 경우) -> 자동 조정
    if (selectedYear !== year || selectedMonth !== month) {
      // 일단 "같은 일자 or 달 마지막 날"로 이동
      const newDay = Math.min(selectedDay, lastDayOfNewMonth);
      setSelectedDate(new Date(year, month, newDay));
    }
  }, [displayDate]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={[tw`flex-1`, { paddingTop: StatusBar.currentHeight || 0 }]}>
        
        {/* 상단 헤더 */}
        <View style={tw`flex-row items-center justify-between px-4 py-3 border-b border-gray-200`}>
          {/* 왼쪽: 뒤로가기 버튼 + 타이틀 */}
          <View style={tw`flex-row items-center`}>
            {/* 뒤로가기 버튼 (눌렀을 때 JournalScreen으로 이동) */}
            <TouchableOpacity
              style={tw`p-2 mr-2`}
              onPress={() => navigation.navigate("Journal")}
            >
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </TouchableOpacity>
            {/* 화면 타이틀: "김가연님의 일지" 등 */}
            <Text style={tw`text-base font-bold`}>
              {name || "아이"}님의 일지
            </Text>
          </View>

          {/* 오른쪽: 일지 목록 버튼 (원치 않으면 제거 가능) */}
          <TouchableOpacity
            style={tw`px-3 py-1 border border-gray-300 rounded-full`}
            onPress={() => {
                // "ChildJournalList" 스크린으로 이동하면서 아이 이름을 전달
                navigation.navigate("ChildJournalList", { name });
            }}
            >
            <Text style={tw`text-sm text-gray-600`}>일지 목록</Text>
            </TouchableOpacity>
        </View>

        {/* 달력 영역 */}
        <ScrollView style={tw`flex-1`}>
          {/* 월/연도 표시 + 이전/다음 달 이동 버튼 */}
          <View style={tw`flex-row items-center justify-center mt-4 mb-2`}>
            <TouchableOpacity onPress={goToPrevMonth} style={tw`p-2`}>
              <Ionicons name="chevron-back-outline" size={24} color="gray" />
            </TouchableOpacity>
            <Text style={tw`mx-4 text-lg font-bold`}>{monthLabel}</Text>
            <TouchableOpacity onPress={goToNextMonth} style={tw`p-2`}>
              <Ionicons name="chevron-forward-outline" size={24} color="gray" />
            </TouchableOpacity>
          </View>

          {/* 요일 헤더 */}
          <View style={tw`flex-row justify-around border-b border-gray-200 pb-2 mb-2 px-2`}>
            {weekDays.map((day) => (
              <Text key={day} style={tw`text-center text-gray-600 font-bold text-base w-12`}>
                {day}
              </Text>
            ))}
          </View>

          {/* 날짜들 (6줄, 7칸) - 크게 보이도록 스타일 조정 */}
          <View style={tw`px-2 mb-4`}>
            {Array.from({ length: 6 }).map((_, rowIndex) => {
              const rowDates = calendarDates.slice(rowIndex * 7, rowIndex * 7 + 7);
              return (
                <View key={rowIndex} style={tw`flex-row justify-between mb-4`}>
                  {rowDates.map((dayObj, colIndex) => {
                    const { value, inCurrentMonth } = dayObj;

                    // 이 날짜가 현재 달의 (year, month)와 동일한지 체크
                    // => selectedDate와 비교
                    const isSelected =
                      inCurrentMonth &&
                      selectedDate.getFullYear() === year &&
                      selectedDate.getMonth() === month &&
                      selectedDate.getDate() === value;

                    // 스타일 결정
                    let dayContainerStyle = tw`w-12 h-8 items-center justify-center rounded-full`;
                    let dayTextStyle = tw`text-base`;

                    if (!inCurrentMonth) {
                      // 다른 달(회색)
                      dayTextStyle = tw`text-base text-gray-300`;
                    } else if (isSelected) {
                        dayContainerStyle = [
                            dayContainerStyle,
                            { backgroundColor: '#F97316' },  // bg-orange-500 대신 직접 색상 코드 사용
                          ];
                          dayTextStyle = [dayTextStyle, tw`text-white font-bold`];
                      dayTextStyle = [dayTextStyle, tw`text-white font-bold`];
                    } else {
                      // 현재 달 + 미선택 => 일반 검정
                      dayTextStyle = [dayTextStyle, tw`text-black`];
                    }

                    return (
                      <TouchableOpacity
                        key={colIndex}
                        style={dayContainerStyle}
                        onPress={() => handleSelectDay(value, inCurrentMonth)}
                      >
                        <Text style={dayTextStyle}>{value}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
          </View>

          {/* 일지 현황 (예: 아직 작성된 일지가 없음) */}
          <View style={tw`px-4 mb-8`}>
            <Text style={tw`text-base font-semibold mb-2`}>일지 현황</Text>
            <View style={tw`p-4 border border-gray-200 rounded-lg bg-white`}>
              <Text style={tw`text-gray-500`}>아직 작성된 일지가 없습니다.</Text>
            </View>
          </View>
        </ScrollView>

        {/* 플로팅 + 버튼 (새 일지 작성용) */}
        <TouchableOpacity
          style={[
            tw`absolute bg-black rounded-full items-center justify-center`,
            { width: 56, height: 56, bottom: 100, right: 20 },
          ]}
          onPress={() => navigation.navigate("JournalWrite")}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>

        {/* 하단 네비게이션 */}
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

export default ChildCalendarScreen;
