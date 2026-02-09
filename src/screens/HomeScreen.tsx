import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="bg-primary pt-12 pb-8 px-6">
        <Text className="text-white text-2xl font-bold">
          Welcome, {user?.firstName}!
        </Text>
        <Text className="text-blue-200 text-sm mt-1">{user?.email}</Text>
      </View>

      {/* Quick Stats */}
      <View className="px-6 -mt-4">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-gray-500 text-xs font-semibold uppercase mb-4">
            Quick Overview
          </Text>
          
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2">
              <View className="bg-blue-50 rounded-xl p-4">
                <Text className="text-3xl font-bold text-primary mb-1">5</Text>
                <Text className="text-gray-600 text-xs">Active Courses</Text>
              </View>
            </View>
            <View className="flex-1 ml-2">
              <View className="bg-emerald-50 rounded-xl p-4">
                <Text className="text-3xl font-bold text-emerald-600 mb-1">92%</Text>
                <Text className="text-gray-600 text-xs">Attendance</Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="flex-1 mr-2">
              <View className="bg-amber-50 rounded-xl p-4">
                <Text className="text-3xl font-bold text-amber-600 mb-1">3</Text>
                <Text className="text-gray-600 text-xs">Pending Tasks</Text>
              </View>
            </View>
            <View className="flex-1 ml-2">
              <View className="bg-purple-50 rounded-xl p-4">
                <Text className="text-3xl font-bold text-purple-600 mb-1">3.8</Text>
                <Text className="text-gray-600 text-xs">Current GPA</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Announcements */}
      <View className="px-6 mt-6">
        <Text className="text-gray-500 text-xs font-semibold uppercase mb-3">
          Recent Announcements
        </Text>
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
          <View className="flex-row items-start">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Text className="text-xl">📢</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-semibold text-sm">Midterm Exam Schedule Released</Text>
              <Text className="text-gray-500 text-xs mt-1">Check your exam dates in the schedule section</Text>
              <Text className="text-gray-400 text-xs mt-2">2 hours ago</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-start">
            <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
              <Text className="text-xl">📚</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-semibold text-sm">New Library Resources Available</Text>
              <Text className="text-gray-500 text-xs mt-1">Digital textbooks added to e-library</Text>
              <Text className="text-gray-400 text-xs mt-2">1 day ago</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
