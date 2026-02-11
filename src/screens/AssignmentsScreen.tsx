import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, StatusBar } from 'react-native';
import { cacheData, getCachedData, isOffline } from '../lib/cache';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface Task {
  id: string;
  status: string;
  assignment: {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    points?: number;
    group?: {
      name: string;
    };
  };
}

export default function AssignmentsScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
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
        setTasks(cached);
        setLoading(false);
      }

      const offline = await isOffline();
      if (!offline) {
        const data = await apiClient.get('/students/my-assignments', { params: { studentId: user?.id } }) as any as Task[];
        if (data) {
          setTasks(data);
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

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return task.status === 'PENDING';
    if (filter === 'submitted') return task.status !== 'PENDING';
    return true;
  });

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
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
      <View className="bg-primary pt-14 pb-8 px-6 rounded-b-[30px]" style={{ backgroundColor: '#1e3a8a' }}>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-[10px] font-black uppercase tracking-[2px] opacity-70">Academic Tasks</Text>
            <Text className="text-white text-3xl font-black">Homework</Text>
          </View>
          <View className="h-12 w-12 bg-white/20 rounded-2xl items-center justify-center border border-white/20">
            <Ionicons name="journal" size={24} color="white" />
          </View>
        </View>
        <Text className="text-blue-100 text-xs mt-2 font-medium">
          You have <Text className="text-white font-bold">{tasks.filter(t => t.status === 'PENDING').length}</Text> tasks to complete
        </Text>
      </View>

      {/* Modern Filter Tabs */}
      <View className="flex-row px-6 py-4">
        {[
          { id: 'all', label: 'Everything', icon: 'grid-outline' },
          { id: 'pending', label: 'Pending', icon: 'time-outline' },
          { id: 'submitted', label: 'Done', icon: 'checkmark-done-outline' }
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setFilter(item.id as any)}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl mr-2 last:mr-0 ${
              filter === item.id ? 'bg-primary shadow-md' : 'bg-white border border-gray-100'
            }`}
            style={filter === item.id ? { backgroundColor: '#1e3a8a' } : {}}
          >
            <Ionicons 
              name={item.icon as any} 
              size={14} 
              color={filter === item.id ? 'white' : '#64748b'} 
              style={{ marginRight: 6 }}
            />
            <Text className={`text-[12px] font-bold ${filter === item.id ? 'text-white' : 'text-slate-500'}`}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />}
      >
        {filteredTasks.length === 0 ? (
          <View className="bg-white rounded-3xl p-10 items-center border border-gray-50 shadow-sm mt-4">
            <View className="h-20 w-20 bg-blue-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="cafe-outline" size={40} color="#1e3a8a" />
            </View>
            <Text className="text-slate-900 font-black text-xl">All caught up!</Text>
            <Text className="text-gray-400 text-sm mt-1 text-center font-medium">
              Refresh the page or check back later for new tasks.
            </Text>
          </View>
        ) : (
          filteredTasks.map((task) => {
            const assignment = task.assignment;
            const submitted = task.status !== 'PENDING';
            const overdue = isOverdue(assignment.dueDate);

            return (
              <TouchableOpacity
                key={task.id}
                activeOpacity={0.7}
                className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-100"
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    {/* Badge */}
                    <View className="flex-row mb-3">
                       <View className={`px-2 py-1 rounded-lg ${submitted ? 'bg-emerald-50' : overdue ? 'bg-red-50' : 'bg-amber-50'}`}>
                         <Text className={`text-[10px] font-black uppercase tracking-wider ${submitted ? 'text-emerald-600' : overdue ? 'text-red-600' : 'text-amber-600'}`}>
                           {submitted ? 'Submitted' : overdue ? 'Overdue' : 'Pending'}
                         </Text>
                       </View>
                    </View>

                    <Text className="text-slate-900 font-bold text-lg leading-tight mb-1">{assignment.title}</Text>
                    
                    <View className="flex-row items-center mb-3">
                       <Ionicons name="people-outline" size={12} color="#94a3b8" />
                       <Text className="text-slate-400 text-[11px] font-bold ml-1 uppercase tracking-tight">
                         {assignment.group?.name || 'Individual'}
                       </Text>
                    </View>

                    {assignment.description && (
                      <Text className="text-slate-500 text-sm font-medium mb-4" numberOfLines={2}>
                        {assignment.description}
                      </Text>
                    )}

                    <View className="flex-row items-center py-3 border-t border-slate-50">
                      <Ionicons name="calendar-outline" size={14} color="#64748b" />
                      <Text className="text-slate-500 text-[11px] font-bold ml-1.5">
                        Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                      </Text>
                      <View className="h-1 w-1 rounded-full bg-slate-200 mx-2" />
                      <Ionicons name="time-outline" size={14} color="#64748b" />
                      <Text className="text-slate-500 text-[11px] font-bold ml-1.5">
                        {overdue && !submitted ? 'Expired' : 'Active'}
                      </Text>
                    </View>
                  </View>

                  {/* Points Bubble */}
                  <View className="ml-4 items-center">
                    <View className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 items-center justify-center">
                      <Text className="text-primary font-black text-lg" style={{ color: '#1e3a8a' }}>{assignment.points || 0}</Text>
                    </View>
                    <Text className="text-slate-300 text-[9px] font-black uppercase tracking-widest mt-1.5">Points</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
