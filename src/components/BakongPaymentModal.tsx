import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import apiClient from '../lib/apiClient';

interface BakongPaymentModalProps {
  visible: boolean;
  invoice: any;
  onClose: () => void;
}

export default function BakongPaymentModal({ visible, invoice, onClose }: BakongPaymentModalProps) {
  const [qrString, setQrString] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'KHR'>('USD');

  useEffect(() => {
    if (visible && invoice) {
      generateQR();
      setIsSuccess(false);
    } else {
      setQrString('');
      setError('');
      setIsLoading(false);
      setIsSuccess(false);
    }
  }, [visible, invoice, currency]);

  // Polling for payment status
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (visible && invoice && qrString && !isSuccess) {
      pollInterval = setInterval(async () => {
        try {
          const response = await apiClient.get(`/financial/bakong-status/${invoice.id}`);
          if (response.isPaid) {
            setIsSuccess(true);
            clearInterval(pollInterval);
            setTimeout(() => {
              onClose();
            }, 3000);
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 3000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [visible, invoice, qrString, isSuccess, onClose]);

  const generateQR = async () => {
    if (!invoice) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/financial/bakong-qr', {
        amount: invoice.totalAmount,
        currency: currency,
        invoiceId: invoice.id,
      });
      setQrString(response.qrString);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to generate QR code';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const amount = currency === 'USD' 
    ? invoice?.totalAmount?.toFixed(2) 
    : (invoice?.totalAmount * 4100).toFixed(0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-3xl overflow-hidden">
          {/* Header */}
          <View className="bg-khqr pt-8 pb-10 px-6 items-center">
            <Text className="text-white text-xl font-bold">KHQR Payment</Text>
            <TouchableOpacity
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full items-center justify-center"
              onPress={onClose}
            >
              <Text className="text-white font-bold">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="max-h-[70vh]">
            <View className="px-6 py-6">
              {/* QR Code */}
              <View className="bg-white border-2 border-gray-100 rounded-2xl p-6 items-center mb-4">
                {isSuccess ? (
                  <View className="w-48 h-48 items-center justify-center">
                    <Text className="text-6xl mb-2">✅</Text>
                    <Text className="text-emerald-600 font-bold text-lg">Payment Confirmed!</Text>
                  </View>
                ) : isLoading ? (
                  <View className="w-48 h-48 items-center justify-center">
                    <ActivityIndicator size="large" color="#D82C26" />
                    <Text className="text-gray-400 text-sm mt-4">Generating QR...</Text>
                  </View>
                ) : error ? (
                  <View className="w-48 h-48 items-center justify-center">
                    <Text className="text-4xl mb-2">❌</Text>
                    <Text className="text-red-500 text-sm text-center">{error}</Text>
                    <TouchableOpacity
                      className="mt-4 bg-khqr px-4 py-2 rounded-lg"
                      onPress={generateQR}
                    >
                      <Text className="text-white font-bold">Retry</Text>
                    </TouchableOpacity>
                  </View>
                ) : qrString ? (
                  <QRCode value={qrString} size={200} />
                ) : null}
              </View>

              {/* Amount */}
              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                <Text className="text-gray-500 text-xs font-semibold uppercase text-center mb-2">
                  Payment Amount
                </Text>
                <Text className="text-gray-900 text-3xl font-bold text-center">
                  {currency === 'USD' ? '$' : '៛'}{amount}
                </Text>
              </View>

              {/* Merchant Info */}
              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                <Text className="text-gray-800 font-bold text-center">STEP Education Center</Text>
                <Text className="text-gray-500 text-xs text-center mt-1">
                  Invoice: {invoice?.id.substring(0, 8).toUpperCase()}
                </Text>
              </View>

              {/* Currency Selector */}
              {!isSuccess && (
                <View className="flex-row bg-gray-100 rounded-xl p-1 mb-4">
                  <TouchableOpacity
                    className={`flex-1 py-3 rounded-lg ${currency === 'USD' ? 'bg-white shadow-sm' : ''}`}
                    onPress={() => setCurrency('USD')}
                  >
                    <Text className={`text-center font-bold ${currency === 'USD' ? 'text-khqr' : 'text-gray-500'}`}>
                      USD
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 py-3 rounded-lg ${currency === 'KHR' ? 'bg-white shadow-sm' : ''}`}
                    onPress={() => setCurrency('KHR')}
                  >
                    <Text className={`text-center font-bold ${currency === 'KHR' ? 'text-khqr' : 'text-gray-500'}`}>
                      KHR
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Status */}
              <View className="items-center py-4">
                {isSuccess ? (
                  <Text className="text-emerald-600 text-sm font-semibold">
                    Closing automatically...
                  </Text>
                ) : (
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                    <Text className="text-gray-500 text-sm">Waiting for payment...</Text>
                  </View>
                )}
              </View>

              {/* Instructions */}
              {!isSuccess && qrString && (
                <View className="bg-blue-50 rounded-xl p-4">
                  <Text className="text-blue-900 font-semibold text-sm mb-2">How to pay:</Text>
                  <Text className="text-blue-700 text-xs leading-5">
                    1. Open your Bakong app{'\n'}
                    2. Scan this QR code{'\n'}
                    3. Confirm the payment{'\n'}
                    4. Payment will be verified automatically
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
