import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function DashboardScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary pt-12 pb-8 px-6">
        <Text className="text-white text-2xl font-bold">
          Welcome, {user?.firstName}!
        </Text>
        <Text className="text-blue-200 text-sm mt-1">
          {user?.email}
        </Text>
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

      {/* Menu Items */}
      <View className="px-6 mt-6">
        <Text className="text-gray-500 text-xs font-semibold uppercase mb-3">
          Quick Actions
        </Text>

        <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
          <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
            <Text className="text-2xl">📚</Text>
          </View>
          <View className="flex-1">
            <Text className="text-gray-800 font-semibold">My Courses</Text>
            <Text className="text-gray-500 text-xs">View enrolled classes</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
          <View className="w-12 h-12 bg-emerald-100 rounded-full items-center justify-center mr-4">
            <Text className="text-2xl">💰</Text>
          </View>
          <View className="flex-1">
            <Text className="text-gray-800 font-semibold">Invoices & Payments</Text>
            <Text className="text-gray-500 text-xs">View bills and pay with KHQR</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
          <View className="w-12 h-12 bg-amber-100 rounded-full items-center justify-center mr-4">
            <Text className="text-2xl">📝</Text>
          </View>
          <View className="flex-1">
            <Text className="text-gray-800 font-semibold">Assignments</Text>
            <Text className="text-gray-500 text-xs">Submit and track work</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
          <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
            <Text className="text-2xl">📊</Text>
          </View>
          <View className="flex-1">
            <Text className="text-gray-800 font-semibold">Grades</Text>
            <Text className="text-gray-500 text-xs">View academic performance</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View className="px-6 mt-8 mb-8">
        <TouchableOpacity
          className="bg-red-50 border border-red-200 rounded-xl py-3 items-center"
          onPress={logout}
        >
          <Text className="text-red-600 font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
