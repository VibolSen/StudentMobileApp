import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import apiClient from '../lib/apiClient';
import { Ionicons } from '@expo/vector-icons';

interface DashboardData {
  enrollments: number;
  pendingAssignmentsCount: number;
  pendingExamsCount: number;
  attendanceRate?: number;
  gpa?: number;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const result = await apiClient.get(`/dashboards/student`, {
        params: { studentId: user.id }
      }) as any;
      setData(result);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Premium Header */}
      <View className="bg-primary pt-14 pb-12 px-6 rounded-b-[40px]" style={{ backgroundColor: '#1e3a8a' }}>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-blue-200 text-xs font-black uppercase tracking-widest opacity-80 mb-1">Welcome Back,</Text>
            <Text className="text-white text-3xl font-black">{user?.firstName} 👋</Text>
          </View>
          <TouchableOpacity className="h-12 w-12 bg-white/20 rounded-2xl items-center justify-center border border-white/20">
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Grid - Overlapping the header */}
      <View className="px-6 -mt-8">
        <View className="bg-white rounded-[32px] p-6 shadow-2xl shadow-slate-200 border border-gray-50">
          <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] mb-5">Quick Metrics</Text>
          
          <View className="flex-row">
            {/* Active Courses */}
            <View className="flex-1 mr-2 p-4 bg-blue-50 rounded-3xl border border-blue-100">
              <View className="h-10 w-10 bg-white rounded-xl items-center justify-center mb-3 shadow-sm">
                <Ionicons name="book" size={20} color="#1e3a8a" />
              </View>
              <Text className="text-slate-900 text-2xl font-black leading-none">{data?.enrollments || 0}</Text>
              <Text className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-tight">Courses</Text>
            </View>

            {/* Attendance */}
            <View className="flex-1 ml-2 p-4 bg-emerald-50 rounded-3xl border border-emerald-100">
               <View className="h-10 w-10 bg-white rounded-xl items-center justify-center mb-3 shadow-sm">
                <Ionicons name="calendar" size={20} color="#059669" />
              </View>
              <Text className="text-emerald-900 text-2xl font-black leading-none">{data?.attendanceRate || 0}%</Text>
              <Text className="text-emerald-600 text-[10px] font-bold mt-1 uppercase tracking-tight">Attendance</Text>
            </View>
          </View>

          <View className="flex-row mt-4">
            {/* Pending Tasks */}
            <View className="flex-1 mr-2 p-4 bg-amber-50 rounded-3xl border border-amber-100">
               <View className="h-10 w-10 bg-white rounded-xl items-center justify-center mb-3 shadow-sm">
                <Ionicons name="clipboard" size={20} color="#d97706" />
              </View>
              <Text className="text-amber-900 text-2xl font-black leading-none">
                {(data?.pendingAssignmentsCount || 0) + (data?.pendingExamsCount || 0)}
              </Text>
              <Text className="text-amber-600 text-[10px] font-bold mt-1 uppercase tracking-tight">Tasks</Text>
            </View>

            {/* GPA */}
            <View className="flex-1 ml-2 p-4 bg-purple-50 rounded-3xl border border-purple-100">
               <View className="h-10 w-10 bg-white rounded-xl items-center justify-center mb-3 shadow-sm">
                <Ionicons name="star" size={20} color="#7c3aed" />
              </View>
              <Text className="text-purple-900 text-2xl font-black leading-none">{data?.gpa || 'N/A'}</Text>
              <Text className="text-purple-600 text-[10px] font-bold mt-1 uppercase tracking-tight">Current GPA</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Announcements */}
      <View className="px-6 mt-10">
        <View className="flex-row justify-between items-center mb-5">
           <Text className="text-slate-900 text-xl font-black tracking-tight">Latest News</Text>
           <TouchableOpacity>
             <Text className="text-primary text-xs font-bold" style={{ color: '#1e3a8a' }}>See All</Text>
           </TouchableOpacity>
        </View>

        {/* Announcement 1 */}
        <TouchableOpacity className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-100 flex-row">
            <View className="h-12 w-12 bg-indigo-50 rounded-2xl items-center justify-center mr-4">
              <Ionicons name="megaphone" size={22} color="#4f46e5" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 font-bold text-base mb-1">Midterm Exams</Text>
              <Text className="text-slate-500 text-xs font-medium leading-relaxed" numberOfLines={2}>
                The schedule for next week's midterm exams has been released.
              </Text>
              <Text className="text-slate-300 text-[10px] font-bold uppercase mt-3 tracking-widest">2h ago</Text>
            </View>
        </TouchableOpacity>

        {/* Announcement 2 */}
        <TouchableOpacity className="bg-white rounded-3xl p-5 mb-8 shadow-sm border border-gray-100 flex-row">
            <View className="h-12 w-12 bg-emerald-50 rounded-2xl items-center justify-center mr-4">
              <Ionicons name="library" size={22} color="#10b981" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 font-bold text-base mb-1">New Library Access</Text>
              <Text className="text-slate-500 text-xs font-medium leading-relaxed" numberOfLines={2}>
                Digital access to the National Library is now available for all students.
              </Text>
              <Text className="text-slate-300 text-[10px] font-bold uppercase mt-3 tracking-widest">1d ago</Text>
            </View>
        </TouchableOpacity>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
