/// <reference types="nativewind/types" />
import './global.css';
import { usePushNotifications } from './src/hooks/usePushNotifications';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { View, ActivityIndicator, Text } from 'react-native';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CoursesScreen from './src/screens/CoursesScreen';
import AssignmentsScreen from './src/screens/AssignmentsScreen';
import InvoicesScreen from './src/screens/InvoicesScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Components
import BakongPaymentModal from './src/components/BakongPaymentModal';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1e3a8a',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📚</Text>,
        }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📝</Text>,
        }}
      />
      <Tab.Screen
        name="Invoices"
        component={InvoicesScreenWrapper}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💰</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

function InvoicesScreenWrapper() {
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handlePayment = (invoice: any) => {
    setSelectedInvoice(invoice);
    setPaymentModalVisible(true);
  };

  return (
    <>
      <InvoicesScreen
        navigation={{
          navigate: (screen: string, params: any) => {
            if (screen === 'BakongPayment') {
              handlePayment(params.invoice);
            }
          },
        }}
      />
      <BakongPaymentModal
        visible={paymentModalVisible}
        invoice={selectedInvoice}
        onClose={() => {
          setPaymentModalVisible(false);
          setSelectedInvoice(null);
        }}
      />
    </>
  );
}

function Navigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const { expoPushToken } = usePushNotifications();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
