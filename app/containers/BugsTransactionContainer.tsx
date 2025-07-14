import React, { useState, useEffect } from 'react';
import { useUserBugsStore } from '~/store/userBugsStore';
import useUserStore from '~/store/userStore';
import { BugsIssue } from '~/api/user_bugs_issues';
import { format } from 'date-fns';

// 컨테이너가 Presentational 컴포넌트에 전달할 데이터와 함수들의 인터페이스
export interface BugsTransactionData {
  bugsIssues: BugsIssue[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  dateRange: string;
  showDatePicker: boolean;
  currentMonth: Date;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  selectingStart: boolean;
  days: (Date | null)[];
  formatTimestamp: (timestamp: number) => string;
  formatDateDisplay: (date: Date) => string;
  isDateSelected: (date: Date) => boolean;
  isStartDate: (date: Date) => boolean;
  isEndDate: (date: Date) => boolean;
}

// 컨테이너가 Presentational 컴포넌트에 전달할 액션 함수들의 인터페이스
export interface BugsTransactionActions {
  handleDateRangeChange: (range: string) => void;
  handleDatePickerToggle: () => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleDateClick: (date: Date) => void;
  resetDateSelection: () => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

interface BugsTransactionContainerProps {
  children: (data: BugsTransactionData, actions: BugsTransactionActions) => React.ReactNode;
}

export default function BugsTransactionContainer({ children }: BugsTransactionContainerProps) {
  // Zustand 스토어에서 데이터와 액션 가져오기
  const { 
    bugsIssues, 
    isLoading, 
    error, 
    totalCount, 
    currentPage,
    fetchBugsIssues,
    getTotalPages, 
    goToNextPage, 
    goToPrevPage, 
    goToFirstPage, 
    goToLastPage
  } = useUserBugsStore();
  
  const { user } = useUserStore();
  
  // 로컬 상태 관리
  const [dateRange, setDateRange] = useState("7일");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectingStart, setSelectingStart] = useState(true);
  
  // 초기 데이터 로드
  useEffect(() => {
    if (user.user_id !== -1) {
      let startDateEpoch = new Date();
      let endDateEpoch = new Date();
      
      // Set date range based on selection
      if (dateRange === "오늘") {
        startDateEpoch = new Date();
        startDateEpoch.setHours(0, 0, 0, 0);
      } else if (dateRange === "7일") {
        startDateEpoch = new Date();
        startDateEpoch.setDate(startDateEpoch.getDate() - 7);
        startDateEpoch.setHours(0, 0, 0, 0);
      }
      
      endDateEpoch.setHours(23, 59, 59, 999);
      fetchBugsIssues(user.user_id, startDateEpoch.toISOString(), endDateEpoch.toISOString(), true);
    }
  }, [user.user_id, dateRange, fetchBugsIssues]);
  
  // 날짜 범위 변경 핸들러
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };
  
  // 타임스탬프 포맷 함수
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return format(date, 'yyyy-MM-dd HH:mm');
  };
  
  // 날짜 피커 토글 핸들러
  const handleDatePickerToggle = () => {
    setShowDatePicker(!showDatePicker);
    if (!showDatePicker) {
      // Reset date picker state when opening
      setCurrentMonth(new Date());
      setSelectingStart(true);
    }
  };
  
  // 이전 달로 이동
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  // 다음 달로 이동
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    if (selectingStart) {
      setSelectedStartDate(date);
      setSelectingStart(false);
    } else {
      // Ensure end date is not before start date
      if (selectedStartDate && date < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      } else {
        setSelectedEndDate(date);
      }
      
      // Apply the date filter
      if (selectedStartDate) {
        applyDateFilter(selectedStartDate, date);
        setShowDatePicker(false);
      }
    }
  };
  
  // 날짜 필터 적용
  const applyDateFilter = (start: Date, end: Date) => {
    const startWithTime = new Date(start);
    startWithTime.setHours(0, 0, 0, 0);
    
    const endWithTime = new Date(end);
    endWithTime.setHours(23, 59, 59, 999);
    
    // Reset the dateRange button selection
    setDateRange("");
    
    // Fetch data with new date range
    fetchBugsIssues(
      user.user_id, 
      startWithTime.toISOString(), 
      endWithTime.toISOString(), 
      true
    );
  };
  
  // 날짜 선택 초기화
  const resetDateSelection = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectingStart(true);
  };
  
  // 달력 생성 함수
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Create array of calendar days including empty cells for proper alignment
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  const days = generateCalendarDays();
  
  // 날짜 표시 형식
  const formatDateDisplay = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };
  
  // 날짜가 선택되었는지 확인
  const isDateSelected = (date: Date) => {
    if (!date || !selectedStartDate) return false;
    
    if (selectedEndDate) {
      // Check if date is between start and end
      return date >= selectedStartDate && date <= selectedEndDate;
    }
    
    // Check if date matches start date
    return date.getDate() === selectedStartDate.getDate() && 
            date.getMonth() === selectedStartDate.getMonth() && 
            date.getFullYear() === selectedStartDate.getFullYear();
  };
  
  // 시작일인지 확인
  const isStartDate = (date: Date) => {
    if (!date || !selectedStartDate) return false;
    
    return date.getDate() === selectedStartDate.getDate() && 
            date.getMonth() === selectedStartDate.getMonth() && 
            date.getFullYear() === selectedStartDate.getFullYear();
  };
  
  // 종료일인지 확인
  const isEndDate = (date: Date) => {
    if (!date || !selectedEndDate) return false;
    
    return date.getDate() === selectedEndDate.getDate() && 
            date.getMonth() === selectedEndDate.getMonth() && 
            date.getFullYear() === selectedEndDate.getFullYear();
  };
  
  // 현재 및 총 페이지 수
  const totalPages = getTotalPages();
  
  // 컨테이너에서 관리하는 데이터
  const data: BugsTransactionData = {
    bugsIssues,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    dateRange,
    showDatePicker,
    currentMonth,
    selectedStartDate,
    selectedEndDate,
    selectingStart,
    days,
    formatTimestamp,
    formatDateDisplay,
    isDateSelected,
    isStartDate,
    isEndDate
  };
  
  // 컨테이너에서 관리하는 액션
  const actions: BugsTransactionActions = {
    handleDateRangeChange,
    handleDatePickerToggle,
    handlePrevMonth,
    handleNextMonth,
    handleDateClick,
    resetDateSelection,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage
  };
  
  return <>{children(data, actions)}</>;
} 