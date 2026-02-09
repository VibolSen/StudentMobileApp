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
} from 'react-native';
import { useAuth } from '../context/AuthContext';

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-8">
        {/* Logo */}
        <View className="items-center mb-12">
          <View className="w-48 h-24 bg-gray-200 rounded-lg items-center justify-center mb-4">
            <Text className="text-2xl font-bold text-primary">STEP</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800">Student Portal</Text>
          <Text className="text-sm text-gray-500 mt-2">Sign in to continue</Text>
        </View>

        {/* Email Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base"
            placeholder="student@stepacademy.edu"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
        </View>

        {/* Password Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Password</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className={`bg-primary rounded-xl py-4 items-center ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <Text className="text-center text-gray-400 text-xs mt-8">
          STEP Education Center © 2026
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
