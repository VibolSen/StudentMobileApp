import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, StatusBar } from 'react-native';
import apiClient from '../lib/apiClient';
import { Ionicons } from '@expo/vector-icons';

interface Invoice {
  id: string;
  totalAmount: number;
  status: 'PAID' | 'SENT' | 'OVERDUE' | 'DRAFT';
  issueDate: string;
  dueDate: string;
  items?: any[];
  payments?: any[];
}

export default function InvoicesScreen({ navigation, onPaymentRequest }: any) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await apiClient.get('/financial/invoices') as any as Invoice[];
      setInvoices(data || []);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchInvoices();
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PAID': return { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Settled', dot: 'bg-emerald-500' };
      case 'SENT': return { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Pending', dot: 'bg-blue-500' };
      case 'OVERDUE': return { bg: 'bg-red-50', text: 'text-red-600', label: 'Overdue', dot: 'bg-red-500' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', label: status, dot: 'bg-gray-400' };
    }
  };

  const getTotalPaid = (invoice: Invoice) => {
    if (!invoice.payments) return 0;
    return invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  };

  const getBalance = (invoice: Invoice) => {
    return invoice.totalAmount - getTotalPaid(invoice);
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
            <Text className="text-blue-200 text-[10px] font-black uppercase tracking-[2px] opacity-70">Financials</Text>
            <Text className="text-white text-3xl font-black">Payments</Text>
          </View>
          <View className="h-12 w-12 bg-white/20 rounded-2xl items-center justify-center border border-white/20">
            <Ionicons name="card" size={24} color="white" />
          </View>
        </View>
        <Text className="text-blue-100 text-xs mt-2 font-medium">
          Manage your tuition and school fees
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />}
      >
        {invoices.length === 0 ? (
          <View className="bg-white rounded-[32px] p-12 items-center border border-gray-50 shadow-sm">
            <View className="h-20 w-20 bg-emerald-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="receipt-outline" size={40} color="#10b981" />
            </View>
            <Text className="text-slate-900 font-black text-xl">All Paid Up!</Text>
            <Text className="text-gray-400 text-sm mt-1 text-center font-medium">
              You don't have any outstanding invoices.
            </Text>
          </View>
        ) : (
          invoices.map((invoice) => {
            const config = getStatusConfig(invoice.status);
            const balance = getBalance(invoice);
            const isPaid = invoice.status === 'PAID';

            return (
              <TouchableOpacity
                key={invoice.id}
                activeOpacity={0.8}
                className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-50"
                onPress={() => navigation.navigate('InvoiceDetail', { invoiceId: invoice.id })}
              >
                <View className="flex-row items-center justify-between mb-3">
                   <View className="flex-row items-center">
                      <View className="h-9 w-9 bg-slate-50 rounded-xl items-center justify-center mr-3 border border-slate-100">
                         <Ionicons name="document-text" size={18} color="#64748b" />
                      </View>
                      <View>
                        <Text className="text-slate-900 font-black text-xs">INV-{invoice.id.substring(0, 6).toUpperCase()}</Text>
                        <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-tight">Tuition Fee</Text>
                      </View>
                   </View>
                   <View className={`flex-row items-center px-2 py-1 rounded-full ${config.bg}`}>
                      <View className={`h-1 w-1 rounded-full mr-1.5 ${config.dot}`} />
                      <Text className={`text-[9px] font-black uppercase ${config.text}`}>{config.label}</Text>
                   </View>
                </View>

                <View className="flex-row justify-between items-end">
                   <View>
                      <Text className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-0.5">Due Amount</Text>
                      <Text className="text-slate-900 text-2xl font-black">${invoice.totalAmount.toFixed(2)}</Text>
                   </View>
                   
                   {!isPaid && balance > 0 && (
                     <TouchableOpacity
                       className="bg-primary px-5 py-2.5 rounded-xl shadow-lg"
                       style={{ backgroundColor: '#1e3a8a' }}
                       onPress={() => onPaymentRequest(invoice)}
                     >
                       <Text className="text-white font-black text-[10px] uppercase tracking-wider">Pay Now</Text>
                     </TouchableOpacity>
                   )}
                </View>

                {!isPaid && balance > 0 && (
                   <View className="mt-4 pt-4 border-t border-slate-50 flex-row justify-between items-center">
                      <Text className="text-slate-400 text-[11px] font-bold">Remaining Balance</Text>
                      <Text className="text-red-500 font-black text-sm">${balance.toFixed(2)}</Text>
                   </View>
                )}
                
                <View className="mt-4 flex-row items-center opacity-40">
                   <Ionicons name="time-outline" size={12} color="#64748b" />
                   <Text className="text-slate-600 text-[10px] font-bold ml-1">
                     Due on {new Date(invoice.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                   </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
