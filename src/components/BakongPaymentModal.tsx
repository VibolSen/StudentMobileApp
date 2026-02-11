import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import apiClient from '../lib/apiClient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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
          const response = await apiClient.get(`/financial/bakong-status/${invoice.id}`) as any;
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
      }) as any;
      setQrString(response.qrString);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to generate QR code';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    if (!val) return '0.00';
    const parts = val.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const amountDisplay = currency === 'USD' 
    ? formatCurrency(invoice?.totalAmount || 0)
    : Math.round((invoice?.totalAmount || 0) * 4100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 items-center justify-center p-4">
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={onClose} 
          className="absolute inset-0" 
        />
        
        <View className="bg-white rounded-[2rem] w-full max-w-[340px] overflow-hidden border border-slate-200">
          
          {/* 1. Guideline Header: Red Banner + KHQR Logo */}
          <View style={{ backgroundColor: '#D82C26', paddingTop: 32, paddingBottom: 44, paddingHorizontal: 20, alignItems: 'center', position: 'relative' }}>
             <TouchableOpacity
                onPress={onClose}
                className="absolute top-4 right-4 p-1"
                style={{ opacity: 0.4 }}
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>

              <View className="flex-col items-center">
                 <Image 
                    source={require('../../assets/Bakong/KHQR_Logo.png')} 
                    className="h-7 w-28"
                    style={{ tintColor: 'white' }}
                    resizeMode="contain"
                 />
              </View>

              {/* Authorized Merchant Badge */}
              <View className="absolute -bottom-3.5 bg-white px-3 py-1 rounded-full border border-slate-100 flex-row items-center">
                 <Ionicons name="checkmark-circle" size={12} color="#10b981" />
                 <Text className="text-slate-800 uppercase ml-1" style={{ fontSize: 9, fontWeight: '900', letterSpacing: 0.5 }}>Authorized Merchant</Text>
              </View>
          </View>

          <View className="px-6 pt-8 pb-6 items-center">
            
            {/* 2. QR Code Area / Success State */}
            <View className="p-3.5 bg-white rounded-2xl border border-slate-100 mb-4 items-center justify-center overflow-hidden">
                {isSuccess ? (
                    <View className="w-[140px] h-[140px] items-center justify-center">
                        <Ionicons name="checkmark-circle" size={60} color="#10b981" />
                        <Text className="uppercase text-emerald-600 mt-2" style={{ fontSize: 11, fontWeight: '900' }}>Payment Paid</Text>
                    </View>
                ) : isLoading ? (
                    <View className="w-[140px] h-[140px] items-center justify-center">
                        <ActivityIndicator size="small" color="#D82C26" />
                        <Text className="text-slate-400 uppercase mt-2" style={{ fontSize: 8, fontWeight: '900' }}>Encoding...</Text>
                    </View>
                ) : error ? (
                    <View className="w-[140px] h-[140px] items-center justify-center p-3">
                        <Ionicons name="close-circle" size={32} color="#ef4444" />
                        <Text className="text-red-500 font-bold text-center mt-1" style={{ fontSize: 10 }}>{error}</Text>
                        <TouchableOpacity onPress={generateQR} className="mt-2 text-slate-400">
                           <Text className="uppercase text-slate-400" style={{ fontSize: 9, fontWeight: '900' }}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    qrString ? (
                        <QRCode 
                            value={qrString} 
                            size={140}
                            logo={require('../../assets/Bakong/icon.png')}
                            logoSize={28}
                            logoBackgroundColor="white"
                            logoBorderRadius={4}
                            logoMargin={2}
                        />
                    ) : (
                       <View className="w-[140px] h-[140px] items-center justify-center">
                          <ActivityIndicator size="small" color="#D82C26" />
                       </View>
                    )
                )}
            </View>

            {/* 3. Amount Section */}
            <View className="items-center mb-4">
                <Text className="text-slate-400 uppercase mb-1" style={{ fontSize: 8, fontWeight: '900', letterSpacing: 1.5 }}>Payment Amount</Text>
                <View className="flex-row items-baseline justify-center">
                    <Text className="font-black text-red-600 mr-1 text-base">{currency === 'USD' ? '$' : '៛'}</Text>
                    <Text className="font-black text-slate-900" style={{ fontSize: 32, letterSpacing: -1 }}>
                        {amountDisplay}
                    </Text>
                </View>
            </View>

            {/* 4. Merchant Info */}
            <View className="w-full bg-slate-50 rounded-xl p-2.5 border border-slate-100 items-center mb-4">
                <Text className="text-slate-800 uppercase" style={{ fontSize: 10, fontWeight: '900', letterSpacing: 0.2 }}>STEP Education Center</Text>
                <Text className="text-slate-400 uppercase mt-0.5" style={{ fontSize: 9, fontWeight: '700' }}>
                    ID: INV-{invoice?.id.substring(0, 8).toUpperCase()}
                </Text>
            </View>

            {/* 5. Currency Selector */}
            {!isSuccess && (
                <View className="flex-row bg-slate-100 p-0.5 rounded-lg border border-slate-200 mb-5">
                    <TouchableOpacity 
                        onPress={() => setCurrency('USD')}
                        className={`px-6 py-1.5 rounded-md ${currency === 'USD' ? 'bg-white border border-slate-200' : ''}`}
                    >
                        <Text className={`uppercase ${currency === 'USD' ? 'text-red-600' : 'text-slate-400'}`} style={{ fontSize: 9, fontWeight: '900', letterSpacing: 0.5 }}>USD</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setCurrency('KHR')}
                        className={`px-6 py-1.5 rounded-md ${currency === 'KHR' ? 'bg-white border border-slate-200' : ''}`}
                    >
                        <Text className={`uppercase ${currency === 'KHR' ? 'text-red-600' : 'text-slate-400'}`} style={{ fontSize: 9, fontWeight: '900', letterSpacing: 0.5 }}>KHR</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* 6. Bakong Footer Branding */}
            <View className="flex-col items-center w-full">
                <View className="flex-row items-center mb-2">
                    <Image 
                        source={require('../../assets/Bakong/icon.png')} 
                        className="h-4 w-4 mr-2"
                        resizeMode="contain"
                    />
                    <View style={{ height: 8, width: 1, backgroundColor: '#cbd5e1', marginHorizontal: 4 }} />
                    <Text className="uppercase underline" style={{ fontSize: 8, fontWeight: '900', letterSpacing: 0.5, textDecorationColor: '#D82C26' }}>
                        Powered by Bakong
                    </Text>
                </View>
                
                {isSuccess ? (
                     <Text className="font-bold text-emerald-600" style={{ fontSize: 10 }}>Confirmed!</Text>
                ) : (
                    <View className="flex-row items-center">
                        <View className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                        <Text className="text-slate-400" style={{ fontSize: 10 }}>Ready to scan</Text>
                    </View>
                )}
            </View>

          </View>
        </View>
      </View>
    </Modal>
  );
}
