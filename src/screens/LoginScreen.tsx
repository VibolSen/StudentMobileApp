import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      {/* Top Header Background */}
      <View 
        className="bg-primary absolute top-0 left-0 right-0 h-[45%] rounded-b-[40px]" 
        style={{ backgroundColor: '#1e3a8a' }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          
          {/* Logo & Welcome Section */}
          <View className="items-center mb-8">
            <View className="w-32 h-32 bg-white rounded-3xl items-center justify-center shadow-2xl mb-6 border border-gray-100">
              <Image 
                source={require('../../assets/STEP.png')} 
                className="w-24 h-24"
                resizeMode="contain"
              />
            </View>
            <Text className="text-white text-3xl font-black tracking-tight">Welcome Back</Text>
            <Text className="text-blue-100 text-sm mt-1 font-medium italic opacity-80">
              Sign in to manage your education
            </Text>
          </View>

          {/* Login Card */}
          <View className="bg-white rounded-[32px] p-8 shadow-2xl border border-gray-50">
            <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[2px] mb-6">Credential Details</Text>
            
            {/* Email Field */}
            <View className="mb-4">
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1">
                 <Text className="text-lg mr-3">📧</Text>
                 <TextInput
                  className="flex-1 h-12 text-slate-900 font-semibold"
                  placeholder="Email Address"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-8">
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1">
                 <Text className="text-lg mr-3">🔒</Text>
                 <TextInput
                  className="flex-1 h-12 text-slate-900 font-semibold"
                  placeholder="Password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>
              <TouchableOpacity className="mt-3 items-end">
                <Text className="text-primary text-[11px] font-bold">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              className={`rounded-2xl py-4 items-center shadow-lg ${isLoading ? 'bg-blue-400' : 'bg-primary'}`}
              style={{ backgroundColor: isLoading ? '#60a5fa' : '#1e3a8a' }}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <View className="flex-row items-center">
                  <Text className="text-white font-black text-lg mr-2 uppercase tracking-wider">Sign In</Text>
                  <Text className="text-white text-lg">🚀</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Branding */}
          <View className="mt-8 items-center">
             <Text className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">
               STEP Education Center
             </Text>
             <View className="flex-row mt-1">
                <View className="h-1 w-8 bg-blue-100 rounded-full mx-1" />
                <View className="h-1 w-2 bg-blue-500 rounded-full mx-1" />
                <View className="h-1 w-1 bg-blue-300 rounded-full mx-1" />
             </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
