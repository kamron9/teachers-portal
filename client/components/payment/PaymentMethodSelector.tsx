import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreditCard,
  Smartphone,
  Building,
  Shield,
  Info,
  Plus,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatUZS } from "@/lib/currency";

interface PaymentMethod {
  id: string;
  type: 'CLICK' | 'PAYME' | 'UZUM_BANK' | 'CARD';
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isAvailable: boolean;
  processingFee?: number; // in kopeks
  estimatedTime: string;
  features: string[];
  minAmount?: number; // in kopeks
  maxAmount?: number; // in kopeks
}

interface SavedPaymentMethod {
  id: string;
  type: 'CARD';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  cardBrand: string;
}

interface PaymentMethodSelectorProps {
  amount: number; // in kopeks
  onMethodSelect: (methodId: string, saveMethod?: boolean) => void;
  onAddCard?: () => void;
  savedMethods?: SavedPaymentMethod[];
  isLoading?: boolean;
  className?: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'click',
    type: 'CLICK',
    name: 'Click',
    description: 'Telefon raqami orqali to\'lov',
    icon: Smartphone,
    isAvailable: true,
    processingFee: 0,
    estimatedTime: 'Bir zumda',
    features: ['Telefon raqami orqali', 'Komisiyasiz', 'Xavfsiz'],
    minAmount: 100000, // 1,000 UZS
    maxAmount: 1000000000, // 10,000,000 UZS
  },
  {
    id: 'payme',
    type: 'PAYME',
    name: 'Payme',
    description: 'Payme ilovasi orqali to\'lov',
    icon: CreditCard,
    isAvailable: true,
    processingFee: 0,
    estimatedTime: 'Bir zumda',
    features: ['Payme ilovasi', 'Barcha kartalar', 'Tez va oson'],
    minAmount: 100000, // 1,000 UZS
    maxAmount: 1000000000, // 10,000,000 UZS
  },
  {
    id: 'uzum_bank',
    type: 'UZUM_BANK',
    name: 'Uzum Bank',
    description: 'Uzum Bank orqali to\'lov',
    icon: Building,
    isAvailable: true,
    processingFee: 0,
    estimatedTime: 'Bir zumda',
    features: ['Uzum Bank kartasi', 'Maxsus chegirmalar', 'Xavfsiz'],
    minAmount: 100000, // 1,000 UZS
    maxAmount: 1000000000, // 10,000,000 UZS
  },
];

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  amount,
  onMethodSelect,
  onAddCard,
  savedMethods = [],
  isLoading = false,
  className,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [saveNewMethod, setSaveNewMethod] = useState(false);
  const [showSavedMethods, setShowSavedMethods] = useState(true);

  // Filter available methods based on amount
  const availableMethods = paymentMethods.filter(method => {
    if (!method.isAvailable) return false;
    if (method.minAmount && amount < method.minAmount) return false;
    if (method.maxAmount && amount > method.maxAmount) return false;
    return true;
  });

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    onMethodSelect(methodId, saveNewMethod);
  };

  const handleSavedMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    onMethodSelect(methodId, false);
  };

  const getMethodIcon = (method: PaymentMethod) => {
    const IconComponent = method.icon;
    return <IconComponent className="h-6 w-6" />;
  };

  const calculateTotal = (method: PaymentMethod) => {
    const fee = method.processingFee || 0;
    return amount + fee;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Payment Amount Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">To'lov miqdori:</span>
            <span className="text-lg font-semibold">{formatUZS(amount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Saved Payment Methods */}
      {savedMethods.length > 0 && showSavedMethods && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Saqlangan to'lov usullari
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RadioGroup value={selectedMethod} onValueChange={handleSavedMethodSelect}>
              {savedMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label 
                    htmlFor={method.id} 
                    className="flex-1 flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">
                          **** **** **** {method.last4}
                        </div>
                        <div className="text-sm text-gray-500">
                          {method.cardBrand} • {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                        </div>
                      </div>
                    </div>
                    {method.isDefault && (
                      <Badge variant="outline">Asosiy</Badge>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSavedMethods(false)}
              className="w-full mt-2"
            >
              Boshqa usul tanlash
            </Button>
          </CardContent>
        </Card>
      )}

      {/* New Payment Methods */}
      {(!showSavedMethods || savedMethods.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4" />
              To'lov usulini tanlang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedMethod} onValueChange={handleMethodSelect}>
              <div className="space-y-3">
                {availableMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label 
                      htmlFor={method.id} 
                      className="flex-1 cursor-pointer"
                    >
                      <Card className={cn(
                        "transition-colors hover:bg-gray-50",
                        selectedMethod === method.id && "ring-2 ring-primary bg-primary/5"
                      )}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              {getMethodIcon(method)}
                              <div className="space-y-1">
                                <div className="font-medium">{method.name}</div>
                                <div className="text-sm text-gray-600">{method.description}</div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>⚡ {method.estimatedTime}</span>
                                  {method.processingFee === 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      Komisiyasiz
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold">
                                {formatUZS(calculateTotal(method))}
                              </div>
                              {method.processingFee > 0 && (
                                <div className="text-xs text-gray-500">
                                  +{formatUZS(method.processingFee)} komisiya
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Method Features */}
                          <div className="mt-3 flex flex-wrap gap-1">
                            {method.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          {/* Amount Limits */}
                          {(method.minAmount || method.maxAmount) && (
                            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              <span>
                                Limitlar: {method.minAmount && formatUZS(method.minAmount)} - {method.maxAmount && formatUZS(method.maxAmount)}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {/* Save Payment Method Option */}
            {selectedMethod && selectedMethod.startsWith('card') && (
              <div className="mt-4 flex items-center space-x-2">
                <Checkbox 
                  id="save-method" 
                  checked={saveNewMethod}
                  onCheckedChange={(checked) => setSaveNewMethod(checked as boolean)}
                />
                <Label htmlFor="save-method" className="text-sm">
                  Keyingi to'lovlar uchun saqlash
                </Label>
              </div>
            )}

            {/* Add New Card Button */}
            {onAddCard && (
              <Button
                variant="outline"
                onClick={onAddCard}
                className="w-full mt-4"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Yangi karta qo'shish
              </Button>
            )}

            {/* Back to Saved Methods */}
            {savedMethods.length > 0 && !showSavedMethods && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSavedMethods(true)}
                className="w-full mt-2"
              >
                Saqlangan usullarga qaytish
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-green-600" />
            <div className="text-sm text-green-800">
              <div className="font-medium">Xavfsiz to'lov</div>
              <div>Barcha to'lovlar 256-bit SSL shifrlash bilan himoyalangan</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unavailable Methods Warning */}
      {availableMethods.length === 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div className="text-sm text-amber-800">
                <div className="font-medium">To'lov usullari mavjud emas</div>
                <div>Joriy miqdor uchun mavjud to'lov usullari yo'q</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
