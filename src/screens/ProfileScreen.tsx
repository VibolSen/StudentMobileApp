import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary pt-12 pb-8 px-6">
        <View className="items-center">
          <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-3">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-white text-xl font-bold">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="text-blue-200 text-sm mt-1">{user?.email}</Text>
        </View>
      </View>

      {/* Profile Info */}
      <View className="px-6 -mt-4">
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <Text className="text-gray-500 text-xs font-semibold uppercase mb-4">
            Account Information
          </Text>
          
          <View className="mb-4">
            <Text className="text-gray-500 text-xs mb-1">Student ID</Text>
            <Text className="text-gray-800 font-semibold">
              {user?.id.substring(0, 8).toUpperCase()}
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-500 text-xs mb-1">Role</Text>
            <Text className="text-gray-800 font-semibold capitalize">{user?.role}</Text>
          </View>

          <View>
            <Text className="text-gray-500 text-xs mb-1">Email</Text>
            <Text className="text-gray-800 font-semibold">{user?.email}</Text>
          </View>
        </View>

        {/* Settings */}
        <View className="bg-white rounded-2xl shadow-sm mb-4">
          <TouchableOpacity className="p-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-xl mr-3">🔔</Text>
                <Text className="text-gray-800 font-semibold">Notifications</Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-xl mr-3">🔒</Text>
                <Text className="text-gray-800 font-semibold">Privacy</Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-xl mr-3">ℹ️</Text>
                <Text className="text-gray-800 font-semibold">About</Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          className="bg-red-50 border border-red-200 rounded-xl py-4 items-center mb-8"
          onPress={logout}
        >
          <Text className="text-red-600 font-bold">Sign Out</Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-400 text-xs mb-8">
          STEP Education Center © 2026
        </Text>
      </View>
    </ScrollView>
  );
}
