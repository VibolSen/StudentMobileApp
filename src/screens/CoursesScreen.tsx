import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, StatusBar } from 'react-native';
import { cacheData, getCachedData, isOffline } from '../lib/cache';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface Course {
  id: string;
  name: string;
  leadBy?: {
    firstName: string;
    lastName: string;
  };
}

export default function CoursesScreen({ navigation }: any) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const cached = await getCachedData('courses');
      if (cached) {
        setCourses(cached);
        setLoading(false);
      }

      const offline = await isOffline();
      if (!offline) {
        const data = await apiClient.get('/students/my-courses', { params: { studentId: user?.id } }) as any as Course[];
        if (data) {
          setCourses(data);
          await cacheData('courses', data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      {/* Premium Header */}
      <View className="bg-primary pt-14 pb-12 px-6 rounded-b-[40px]" style={{ backgroundColor: '#1e3a8a' }}>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-blue-200 text-[10px] font-black uppercase tracking-[2px] opacity-70">Learning Portal</Text>
            <Text className="text-white text-3xl font-black">My Courses</Text>
          </View>
          <View className="h-12 w-12 bg-white/20 rounded-2xl items-center justify-center border border-white/20">
            <Ionicons name="library" size={24} color="white" />
          </View>
        </View>
        <Text className="text-blue-100 text-xs mt-2 font-medium">
          Enrolled in <Text className="text-white font-bold">{courses.length}</Text> active subjects
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />}
      >
        {courses.length === 0 ? (
          <View className="bg-white rounded-[32px] p-12 items-center border border-gray-50 shadow-sm">
            <View className="h-20 w-20 bg-blue-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="book-outline" size={40} color="#1e3a8a" />
            </View>
            <Text className="text-slate-900 font-black text-xl">No Courses Yet</Text>
            <Text className="text-gray-400 text-sm mt-1 text-center font-medium">
              You haven't been enrolled in any courses for this term.
            </Text>
          </View>
        ) : (
          courses.map((course, idx) => {
            const colors = [
              { bg: 'bg-blue-50', icon: 'bg-blue-100', text: 'text-blue-600' },
              { bg: 'bg-indigo-50', icon: 'bg-indigo-100', text: 'text-indigo-600' },
              { bg: 'bg-emerald-50', icon: 'bg-emerald-100', text: 'text-emerald-600' },
              { bg: 'bg-purple-50', icon: 'bg-purple-100', text: 'text-purple-600' },
            ];
            const color = colors[idx % colors.length];

            return (
              <TouchableOpacity
                key={course.id}
                activeOpacity={0.7}
                className="bg-white rounded-[32px] p-2 mb-4 shadow-sm border border-gray-100 flex-row items-center"
                onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
              >
                <View className={`h-20 w-20 rounded-[24px] items-center justify-center mr-4 ${color.bg}`}>
                  <Ionicons name="bookmark" size={28} className={color.text} color={color.text === 'text-blue-600' ? '#2563eb' : color.text === 'text-indigo-600' ? '#4f46e5' : color.text === 'text-emerald-600' ? '#059669' : '#7c3aed'} />
                </View>
                <View className="flex-1 pr-4">
                  <Text className="text-slate-900 font-bold text-base leading-tight" numberOfLines={2}>
                    {course.name}
                  </Text>
                  {course.leadBy && (
                    <Text className="text-slate-400 text-[11px] font-bold mt-1 uppercase tracking-tight">
                       Prof. {course.leadBy.firstName} {course.leadBy.lastName}
                    </Text>
                  )}
                  <View className="flex-row items-center mt-3">
                     <View className="flex-row items-center bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                        <View className="h-1 w-1 rounded-full bg-emerald-500 mr-1.5" />
                        <Text className="text-emerald-600 text-[9px] font-black uppercase">Active</Text>
                     </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#cbd5e1" className="mr-2" />
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>
    </View>
  );
}
