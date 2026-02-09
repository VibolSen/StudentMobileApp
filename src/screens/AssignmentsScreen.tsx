import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { cacheData, getCachedData, isOffline } from '../lib/cache';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

interface Assignment {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  points?: number;
  group?: {
    name: string;
  };
  submissions?: any[];
}

export default function AssignmentsScreen() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted'>('all');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const cached = await getCachedData('assignments');
      if (cached) {
        setAssignments(cached);
        setLoading(false);
      }

      const offline = await isOffline();
      if (!offline) {
        const data = await apiClient.get('/students/my-assignments', { params: { studentId: user?.id } }) as any as Assignment[];
        if (data) {
          setAssignments(data);
          await cacheData('assignments', data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAssignments();
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'pending') return !assignment.submissions || assignment.submissions.length === 0;
    if (filter === 'submitted') return assignment.submissions && assignment.submissions.length > 0;
    return true;
  });

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
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
        <Text className="text-white text-2xl font-bold">Assignments</Text>
        <Text className="text-blue-200 text-sm mt-1">{assignments.length} total assignments</Text>
      </View>

      {/* Filter Tabs */}
      <View className="bg-white px-6 py-3 flex-row">
        <TouchableOpacity
          className={`px-4 py-2 rounded-lg mr-2 ${filter === 'all' ? 'bg-primary' : 'bg-gray-100'}`}
          onPress={() => setFilter('all')}
        >
          <Text className={`text-sm font-semibold ${filter === 'all' ? 'text-white' : 'text-gray-600'}`}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 rounded-lg mr-2 ${filter === 'pending' ? 'bg-amber-500' : 'bg-gray-100'}`}
          onPress={() => setFilter('pending')}
        >
          <Text className={`text-sm font-semibold ${filter === 'pending' ? 'text-white' : 'text-gray-600'}`}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 rounded-lg ${filter === 'submitted' ? 'bg-emerald-500' : 'bg-gray-100'}`}
          onPress={() => setFilter('submitted')}
        >
          <Text className={`text-sm font-semibold ${filter === 'submitted' ? 'text-white' : 'text-gray-600'}`}>
            Submitted
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="px-6 py-4">
          {filteredAssignments.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <Text className="text-6xl mb-4">📝</Text>
              <Text className="text-gray-800 font-semibold text-lg">No Assignments</Text>
              <Text className="text-gray-500 text-sm mt-2 text-center">
                {filter === 'pending' ? 'All caught up!' : 'No assignments found'}
              </Text>
            </View>
          ) : (
            filteredAssignments.map((assignment) => {
              const submitted = assignment.submissions && assignment.submissions.length > 0;
              const overdue = isOverdue(assignment.dueDate);

              return (
                <TouchableOpacity
                  key={assignment.id}
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="text-gray-800 font-bold text-base">{assignment.title}</Text>
                      {assignment.group && (
                        <Text className="text-gray-500 text-sm mt-1">{assignment.group.name}</Text>
                      )}
                      {assignment.description && (
                        <Text className="text-gray-600 text-sm mt-2" numberOfLines={2}>
                          {assignment.description}
                        </Text>
                      )}
                      <View className="flex-row items-center mt-3">
                        {submitted ? (
                          <View className="bg-emerald-100 px-2 py-1 rounded-md mr-2">
                            <Text className="text-emerald-700 text-xs font-semibold">✓ Submitted</Text>
                          </View>
                        ) : overdue ? (
                          <View className="bg-red-100 px-2 py-1 rounded-md mr-2">
                            <Text className="text-red-700 text-xs font-semibold">Overdue</Text>
                          </View>
                        ) : (
                          <View className="bg-amber-100 px-2 py-1 rounded-md mr-2">
                            <Text className="text-amber-700 text-xs font-semibold">Pending</Text>
                          </View>
                        )}
                        {assignment.dueDate && (
                          <Text className="text-gray-400 text-xs">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </Text>
                        )}
                      </View>
                    </View>
                    {assignment.points && (
                      <View className="ml-3">
                        <View className="bg-purple-100 w-12 h-12 rounded-full items-center justify-center">
                          <Text className="text-purple-700 font-bold text-sm">{assignment.points}</Text>
                        </View>
                        <Text className="text-gray-400 text-xs text-center mt-1">pts</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
