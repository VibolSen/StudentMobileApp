import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const MenuItem = ({ icon, label, color, last, onPress }: any) => (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center justify-between p-5 ${!last ? 'border-b border-slate-50' : ''}`}
    >
      <View className="flex-row items-center">
        <View className={`h-10 w-10 rounded-xl items-center justify-center mr-4 ${color}`}>
          <Ionicons name={icon} size={20} color="white" />
        </View>
        <Text className="text-slate-700 font-bold text-base">{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      {/* Premium Profile Header */}
      <View className="bg-primary pt-14 pb-16 px-6 rounded-b-[40px] items-center" style={{ backgroundColor: '#1e3a8a' }}>
        <View className="relative">
          <View className="w-28 h-28 bg-white/20 rounded-full border-4 border-white/30 items-center justify-center p-1">
            <View className="w-full h-full bg-white rounded-full items-center justify-center">
               <Text className="text-5xl">🎓</Text>
            </View>
          </View>
          <TouchableOpacity 
             className="absolute bottom-0 right-0 bg-emerald-500 h-9 w-9 rounded-full border-4 border-white items-center justify-center shadow-lg"
          >
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        
        <Text className="text-white text-2xl font-black mt-4">
          {user?.firstName} {user?.lastName}
        </Text>
        <Text className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">
          Student • ID: {user?.id.substring(0, 8).toUpperCase()}
        </Text>
      </View>

      <View className="px-6 -mt-8">
        {/* Account Info Card */}
        <View className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden mb-6">
          <View className="p-6 pb-2">
             <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[2px]">Core Details</Text>
          </View>
          
          <MenuItem icon="mail" label={user?.email || 'N/A'} color="bg-blue-500" />
          <MenuItem icon="shield-checkmark" label="Two-Factor Auth" color="bg-indigo-500" />
          <MenuItem icon="person" label="Edit Profile" color="bg-purple-500" last />
        </View>

        {/* Preferences Card */}
        <View className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden mb-8">
          <View className="p-6 pb-2">
             <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[2px]">Preferences</Text>
          </View>
          
          <MenuItem icon="notifications" label="Notifications" color="bg-amber-500" />
          <MenuItem icon="color-palette" label="App Appearance" color="bg-sky-500" />
          <MenuItem icon="help-circle" label="Support Center" color="bg-emerald-500" last />
        </View>

        {/* Action Buttons */}
        <View className="space-y-4 mb-10">
           <TouchableOpacity 
             className="bg-red-50 py-5 rounded-[24px] border border-red-100 flex-row items-center justify-center shadow-sm"
             onPress={logout}
           >
              <Ionicons name="log-out-outline" size={20} color="#ef4444" className="mr-2" />
              <Text className="text-red-600 font-black uppercase tracking-widest text-xs">Sign Out Account</Text>
           </TouchableOpacity>

           
        </View>
      </View>
    </ScrollView>
  );
}
