import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function CourseDetailScreen({ route, navigation }: any) {
  const { courseId } = route.params;
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get(`/courses/${courseId}`);
      setCourse(data);
      // Fetch announcements for this course
      const annData = await apiClient.get(`/announcements`, {
        params: { courseId }
      }) as any;
      setAnnouncements(annData || []);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourseDetails();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  if (!course) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <Ionicons name="information-circle-outline" size={64} color="#cbd5e1" />
        <Text className="text-xl font-bold text-slate-900 mt-4">Course Not Found</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mt-6 bg-primary px-6 py-3 rounded-xl shadow-sm"
          style={{ backgroundColor: '#1e3a8a' }}
        >
          <Text className="text-white font-bold">Back to Courses</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      {/* Premium Header */}
      <View className="bg-primary pt-14 pb-12 px-6 rounded-b-[40px]" style={{ backgroundColor: '#1e3a8a' }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mb-6 flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text className="text-white font-bold ml-2">My Courses</Text>
        </TouchableOpacity>

        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <View className="bg-white/20 px-2 py-0.5 rounded-full self-start mb-2 border border-white/20">
              <Text className="text-white text-[10px] font-black uppercase tracking-wider">
                {course.courseDepartments?.[0]?.department?.name || "Academic"}
              </Text>
            </View>
            <Text className="text-white text-3xl font-black leading-tight">
              {course.name}
            </Text>
            <Text className="text-blue-200 text-[10px] font-mono mt-2 uppercase tracking-tight opacity-70">
              COURSE ID: {course.id?.slice(-8).toUpperCase()}
            </Text>
          </View>
          <View className="h-16 w-16 bg-white/10 rounded-3xl items-center justify-center border border-white/10">
            <Ionicons name="book" size={32} color="white" opacity={0.3} />
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />}
      >
        {/* Main Content Sections */}
        <View className="space-y-6">
          
          {/* Latest Announcements */}
          <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <View className="px-5 py-4 border-b border-gray-50 flex-row items-center">
              <View className="h-8 w-8 bg-orange-50 rounded-xl items-center justify-center mr-3">
                <Ionicons name="chatbox-ellipses" size={18} color="#f97316" />
              </View>
              <Text className="text-slate-900 font-bold text-lg">Announcements</Text>
            </View>
            
            <View className="p-5">
              {announcements.length === 0 ? (
                <Text className="text-slate-400 text-sm italic py-2">No announcements for this course yet.</Text>
              ) : (
                announcements.slice(0, 3).map((ann, idx) => (
                  <View key={ann.id} className={`py-3 ${idx !== 0 ? 'border-t border-slate-50' : ''}`}>
                    <Text className="text-slate-800 font-bold text-sm mb-1">{ann.title}</Text>
                    <Text className="text-slate-500 text-xs leading-5" numberOfLines={2}>{ann.content}</Text>
                    <Text className="text-slate-300 text-[9px] font-bold uppercase mt-2">
                       {new Date(ann.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* About Course */}
          <View className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <Text className="text-slate-900 font-bold text-lg mb-3">About this Course</Text>
            <Text className="text-slate-500 text-sm leading-6 italic">
              "No detailed description provided for this course yet."
            </Text>
          </View>

          {/* Instructor & Actions Column (Stacked on mobile) */}
          <View className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
            <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] mb-4">Your Instructor</Text>
            <View className="flex-row items-center mb-6">
              <View className="h-14 w-14 bg-blue-500 rounded-2xl items-center justify-center shadow-lg shadow-blue-200">
                <Ionicons name="person" size={28} color="white" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-slate-900 font-black text-lg leading-tight">
                  {course.leadBy ? `${course.leadBy.firstName} ${course.leadBy.lastName}` : "Unassigned"}
                </Text>
                <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-tight mt-0.5">Course Lead</Text>
              </View>
            </View>
            
            <View className="space-y-3 pt-2 border-t border-slate-50 mt-2">
               <View className="flex-row items-center">
                  <Ionicons name="mail-outline" size={14} color="#94a3b8" />
                  <Text className="text-slate-500 text-xs font-bold ml-2.5 tracking-tight">instructor@step.education</Text>
               </View>
               <View className="flex-row items-center mt-2">
                  <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
                  <Text className="text-slate-500 text-xs font-bold ml-2.5 tracking-tight">Available: Mon - Fri</Text>
               </View>
            </View>
          </View>

          {/* Quick Access Card */}
          <View className="bg-primary rounded-3xl p-6 shadow-xl" style={{ backgroundColor: '#1e3a8a' }}>
             <Text className="text-blue-200 text-[10px] font-black uppercase tracking-[2px] mb-4">Quick Access</Text>
             
             <TouchableOpacity className="bg-white/10 py-4 px-5 rounded-2xl flex-row items-center justify-between mb-3 border border-white/5">
                <View className="flex-row items-center">
                   <Ionicons name="folder-open" size={18} color="#93c5fd" />
                   <Text className="text-white font-bold ml-3 text-sm">Course Resources</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#60a5fa" />
             </TouchableOpacity>

             <TouchableOpacity className="bg-white/10 py-4 px-5 rounded-2xl flex-row items-center justify-between border border-white/5">
                <View className="flex-row items-center">
                   <Ionicons name="list" size={18} color="#93c5fd" />
                   <Text className="text-white font-bold ml-3 text-sm">Assignment List</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#60a5fa" />
             </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
