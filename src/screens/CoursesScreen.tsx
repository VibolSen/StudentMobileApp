import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { cacheData, getCachedData, isOffline } from '../lib/cache';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

interface Course {
  id: string;
  name: string;
  leadBy?: {
    firstName: string;
    lastName: string;
  };
}

export default function CoursesScreen() {
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
      // Load from cache first for immediate display
      const cached = await getCachedData('courses');
      if (cached) {
        setCourses(cached);
        setLoading(false); // Show cached data immediately
      }

      const offline = await isOffline();
      if (!offline) {
        // Fetch fresh data if online
        const data = await apiClient.get('/students/my-courses', { params: { studentId: user?.id } }) as any as Course[];
        if (data) {
          setCourses(data);
          // Cache the new data
          await cacheData('courses', data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      // If error (e.g. network failure), we already showed cached data if available
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Force fetch ignores cache logic slightly or just re-runs it
    // But since fetchCourses checks online, it works.
    fetchCourses();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary pt-12 pb-6 px-6">
        <Text className="text-white text-2xl font-bold">My Courses</Text>
        <Text className="text-blue-200 text-sm mt-1">{courses.length} enrolled courses</Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="px-6 py-4">
          {courses.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <Text className="text-6xl mb-4">📚</Text>
              <Text className="text-gray-800 font-semibold text-lg">No Courses Yet</Text>
              <Text className="text-gray-500 text-sm mt-2 text-center">
                You haven't enrolled in any courses
              </Text>
            </View>
          ) : (
            courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm"
              >
                <View className="flex-row items-start">
                  <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mr-4">
                    <Text className="text-2xl">📖</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-base">{course.name}</Text>
                    {course.leadBy && (
                      <Text className="text-gray-500 text-sm mt-1">
                        Instructor: {course.leadBy.firstName} {course.leadBy.lastName}
                      </Text>
                    )}
                    <View className="flex-row items-center mt-2">
                      <View className="bg-emerald-100 px-2 py-1 rounded-md mr-2">
                        <Text className="text-emerald-700 text-xs font-semibold">Active</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
