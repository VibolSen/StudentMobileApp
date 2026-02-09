import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import apiClient from '../lib/apiClient';

interface Invoice {
  id: string;
  totalAmount: number;
  status: 'PAID' | 'SENT' | 'OVERDUE' | 'DRAFT';
  issueDate: string;
  dueDate: string;
  items?: any[];
  payments?: any[];
}

export default function InvoicesScreen({ navigation }: any) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await apiClient.get('/financial/invoices');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
      case 'SENT': return { bg: 'bg-blue-100', text: 'text-blue-700' };
      case 'OVERDUE': return { bg: 'bg-red-100', text: 'text-red-700' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  };

  const getTotalPaid = (invoice: Invoice) => {
    if (!invoice.payments) return 0;
    return invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  };

  const getBalance = (invoice: Invoice) => {
    return invoice.totalAmount - getTotalPaid(invoice);
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
        <Text className="text-white text-2xl font-bold">Invoices</Text>
        <Text className="text-blue-200 text-sm mt-1">{invoices.length} total invoices</Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="px-6 py-4">
          {invoices.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <Text className="text-6xl mb-4">💰</Text>
              <Text className="text-gray-800 font-semibold text-lg">No Invoices</Text>
              <Text className="text-gray-500 text-sm mt-2 text-center">
                You don't have any invoices yet
              </Text>
            </View>
          ) : (
            invoices.map((invoice) => {
              const statusColors = getStatusColor(invoice.status);
              const balance = getBalance(invoice);
              const isPaid = invoice.status === 'PAID';

              return (
                <TouchableOpacity
                  key={invoice.id}
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                  onPress={() => navigation.navigate('InvoiceDetail', { invoiceId: invoice.id })}
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-gray-800 font-bold text-base">
                        INV-{invoice.id.substring(0, 8).toUpperCase()}
                      </Text>
                      <Text className="text-gray-500 text-sm mt-1">
                        Issued: {new Date(invoice.issueDate).toLocaleDateString()}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <View className={`${statusColors.bg} px-3 py-1 rounded-full`}>
                      <Text className={`${statusColors.text} text-xs font-bold uppercase`}>
                        {invoice.status}
                      </Text>
                    </View>
                  </View>

                  <View className="border-t border-gray-100 pt-3">
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-gray-500 text-xs">Total Amount</Text>
                        <Text className="text-gray-800 font-bold text-lg">
                          ${invoice.totalAmount.toFixed(2)}
                        </Text>
                      </View>
                      {!isPaid && balance > 0 && (
                        <TouchableOpacity
                          className="bg-khqr px-4 py-2 rounded-lg"
                          onPress={() => navigation.navigate('BakongPayment', { invoice })}
                        >
                          <Text className="text-white font-bold text-sm">Pay with KHQR</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    {!isPaid && balance > 0 && (
                      <Text className="text-amber-600 text-xs mt-2">
                        Balance Due: ${balance.toFixed(2)}
                      </Text>
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
