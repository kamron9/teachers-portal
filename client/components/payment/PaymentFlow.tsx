import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Clock,
  CreditCard,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  ExternalLink,
  Shield,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatUZS } from "@/lib/currency";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { useCreatePayment, usePaymentStatus } from "@/hooks/useApi";
import { toast } from "sonner";

interface PaymentItem {
  id: string;
  type: 'lesson' | 'package';
  name: string;
  description: string;
  amount: number; // in kopeks
  quantity?: number;
  teacherName?: string;
  date?: string;
  time?: string;
}

interface PaymentFlowProps {
  items: PaymentItem[];
  totalAmount: number; // in kopeks
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
  onError?: (error: string) => void;
  bookingId?: string;
  packageId?: string;
  className?: string;
}

type PaymentStep = 'items' | 'method' | 'processing' | 'redirect' | 'success' | 'failed';

export const PaymentFlow: React.FC<PaymentFlowProps> = ({
  items,
  totalAmount,
  onSuccess,
  onCancel,
  onError,
  bookingId,
  packageId,
  className,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<PaymentStep>('items');
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');
  const [providerUrl, setProviderUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const [retryCount, setRetryCount] = useState(0);

  const createPaymentMutation = useCreatePayment();
  const { data: paymentStatus, refetch: refetchStatus } = usePaymentStatus(
    paymentId,
    { enabled: !!paymentId && currentStep === 'processing' }
  );

  // Timer for payment timeout
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentStep === 'processing' || currentStep === 'redirect') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCurrentStep('failed');
            onError?.('To\'lov vaqti tugadi');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStep, onError]);

  // Poll payment status
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (paymentId && (currentStep === 'processing' || currentStep === 'redirect')) {
      pollInterval = setInterval(() => {
        refetchStatus();
      }, 2000); // Poll every 2 seconds
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [paymentId, currentStep, refetchStatus]);

  // Handle payment status changes
  useEffect(() => {
    if (paymentStatus) {
      switch (paymentStatus.status) {
        case 'COMPLETED':
          setCurrentStep('success');
          onSuccess(paymentId);
          break;
        case 'FAILED':
          setCurrentStep('failed');
          onError?.(paymentStatus.failureReason || 'To\'lov amalga oshmadi');
          break;
        case 'PENDING':
          if (currentStep !== 'processing' && currentStep !== 'redirect') {
            setCurrentStep('processing');
          }
          break;
      }
    }
  }, [paymentStatus, currentStep, paymentId, onSuccess, onError]);

  const handleMethodSelect = async (methodId: string, saveMethod?: boolean) => {
    setSelectedMethodId(methodId);
    setCurrentStep('processing');

    try {
      const result = await createPaymentMutation.mutateAsync({
        amount: totalAmount,
        provider: methodId.toUpperCase() as any,
        bookingId,
        packageId,
        savePaymentMethod: saveMethod,
        returnUrl: `${window.location.origin}/payment/callback`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      });

      setPaymentId(result.payment.id);

      // If there's a redirect URL, show redirect step
      if (result.paymentUrl) {
        setProviderUrl(result.paymentUrl);
        setCurrentStep('redirect');
      }
    } catch (error: any) {
      setCurrentStep('failed');
      toast.error(error.message || 'To\'lov yaratilmadi');
      onError?.(error.message || 'To\'lov yaratilmadi');
    }
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setCurrentStep('method');
      setTimeLeft(300);
    } else {
      toast.error('Maksimal urinishlar soni tugadi');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'items': return 25;
      case 'method': return 50;
      case 'processing': return 75;
      case 'redirect': return 85;
      case 'success': return 100;
      case 'failed': return 50;
      default: return 0;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'items':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>To'lov tafsilotlari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.description}</div>
                      {item.teacherName && (
                        <div className="text-sm text-gray-500">
                          O'qituvchi: {item.teacherName}
                        </div>
                      )}
                      {item.date && item.time && (
                        <div className="text-sm text-gray-500">
                          {item.date} • {item.time}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatUZS(item.amount)}</div>
                      {item.quantity && item.quantity > 1 && (
                        <div className="text-xs text-gray-500">
                          {item.quantity} x {formatUZS(item.amount / item.quantity)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Jami:</span>
                    <span>{formatUZS(totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Orqaga
              </Button>
              <Button 
                onClick={() => setCurrentStep('method')}
                className="flex-1"
              >
                To'lov usulini tanlash
              </Button>
            </div>
          </div>
        );

      case 'method':
        return (
          <div className="space-y-6">
            <PaymentMethodSelector
              amount={totalAmount}
              onMethodSelect={handleMethodSelect}
            />

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('items')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Orqaga
              </Button>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="space-y-6 text-center">
            <Card>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold mb-2">To'lov qayta ishlanmoqda</h3>
                <p className="text-gray-600 mb-4">
                  Iltimos, sahifani yopmang va kutib turing
                </p>
                <div className="text-sm text-gray-500">
                  Qolgan vaqt: {formatTime(timeLeft)}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                To'lov jarayoni bir necha daqiqa davom etishi mumkin. 
                Sahifani yopmasdan kutib turing.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'redirect':
        return (
          <div className="space-y-6 text-center">
            <Card>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">To'lov provayderi sahifasiga o'ting</h3>
                <p className="text-gray-600 mb-4">
                  To'lovni yakunlash uchun quyidagi tugmani bosing
                </p>
                
                <Button 
                  onClick={() => window.open(providerUrl, '_blank')}
                  className="mb-4"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  To'lov sahifasiga o'tish
                </Button>

                <div className="text-sm text-gray-500">
                  Qolgan vaqt: {formatTime(timeLeft)}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                To'lovni amalga oshirgandan so'ng, avtomatik ravishda bu sahifaga qaytasiz.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-6 text-center">
            <Card>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">To'lov muvaffaqiyatli!</h3>
                <p className="text-gray-600 mb-4">
                  Sizning to'lovingiz qabul qilindi va tasdiqlandi
                </p>
                <div className="text-lg font-semibold text-green-600">
                  {formatUZS(totalAmount)}
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => navigate('/student-dashboard')}>
              Dashboard ga o'tish
            </Button>
          </div>
        );

      case 'failed':
        return (
          <div className="space-y-6 text-center">
            <Card>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">To'lov amalga oshmadi</h3>
                <p className="text-gray-600 mb-4">
                  To'lov jarayonida xatolik yuz berdi
                </p>
                {paymentStatus?.failureReason && (
                  <p className="text-sm text-red-600 mb-4">
                    Sabab: {paymentStatus.failureReason}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={onCancel}>
                Bekor qilish
              </Button>
              {retryCount < 3 && (
                <Button onClick={handleRetry}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Qayta urinish ({3 - retryCount} ta qoldi)
                </Button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      {/* Progress Header */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">To'lov jarayoni</h2>
              <Badge variant="outline">
                {getStepProgress()}%
              </Badge>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
            <div className="flex justify-between text-sm text-gray-500">
              <span className={currentStep === 'items' ? 'font-medium text-gray-900' : ''}>
                Tafsilotlar
              </span>
              <span className={currentStep === 'method' ? 'font-medium text-gray-900' : ''}>
                To'lov usuli
              </span>
              <span className={['processing', 'redirect'].includes(currentStep) ? 'font-medium text-gray-900' : ''}>
                Jarayon
              </span>
              <span className={currentStep === 'success' ? 'font-medium text-gray-900' : ''}>
                Tasdiqlash
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {renderStepContent()}

      {/* Security Footer */}
      <Card className="mt-6 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-center">
            <Shield className="h-5 w-5 text-green-600" />
            <div className="text-sm text-green-800">
              Barcha to'lovlar SSL shifrlash va PCI DSS standartlari bilan himoyalangan
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
