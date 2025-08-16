import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building,
  Smartphone,
  Plus,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatUZS, PRICE_CONSTANTS, validateUZSAmount } from "@/lib/currency";
import { useWalletBalance, useWalletEntries, useRequestPayout } from "@/hooks/useApi";
import { toast } from "sonner";

interface WalletEntry {
  id: string;
  amount: number; // in kopeks
  commission: number; // in kopeks
  status: 'PENDING' | 'AVAILABLE' | 'PAID';
  description: string;
  bookingId?: string;
  packageId?: string;
  availableAt?: string;
  createdAt: string;
  studentName?: string;
  lessonSubject?: string;
}

interface PayoutRequest {
  id: string;
  amount: number; // in kopeks
  method: 'bank_transfer' | 'card';
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'FAILED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  failureReason?: string;
  accountRef: string;
}

interface TeacherWalletProps {
  className?: string;
}

export const TeacherWallet: React.FC<TeacherWalletProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'entries' | 'payouts'>('overview');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'bank_transfer' | 'card'>('bank_transfer');
  const [accountDetails, setAccountDetails] = useState('');
  const [payoutNote, setPayoutNote] = useState('');

  // API hooks
  const { data: walletData, isLoading: walletLoading } = useWalletBalance();
  const { data: entriesData, isLoading: entriesLoading } = useWalletEntries({
    page: 1,
    limit: 20,
  });
  const requestPayoutMutation = useRequestPayout();

  // Mock data for development
  const mockWalletData = {
    pendingAmount: 15000000, // 150,000 UZS
    availableAmount: 45000000, // 450,000 UZS
    totalEarnings: 60000000, // 600,000 UZS
    lastPayoutAt: '2024-01-15T10:00:00Z',
  };

  const mockEntries: WalletEntry[] = [
    {
      id: '1',
      amount: 4500000, // 45,000 UZS
      commission: 675000, // 6,750 UZS (15%)
      status: 'AVAILABLE',
      description: 'Ingliz tili darsi',
      bookingId: 'booking-1',
      studentName: 'Aziza Karimova',
      lessonSubject: 'Ingliz tili',
      availableAt: '2024-01-20T10:00:00Z',
      createdAt: '2024-01-18T14:00:00Z',
    },
    {
      id: '2',
      amount: 6000000, // 60,000 UZS
      commission: 900000, // 9,000 UZS
      status: 'PENDING',
      description: 'IELTS tayyorgarlik',
      bookingId: 'booking-2',
      studentName: 'Bobur Umarov',
      lessonSubject: 'IELTS',
      availableAt: '2024-01-25T10:00:00Z',
      createdAt: '2024-01-20T16:00:00Z',
    },
  ];

  const mockPayouts: PayoutRequest[] = [
    {
      id: '1',
      amount: 30000000, // 300,000 UZS
      method: 'bank_transfer',
      status: 'APPROVED',
      requestedAt: '2024-01-15T09:00:00Z',
      processedAt: '2024-01-16T14:00:00Z',
      accountRef: '**** **** **** 1234',
    },
    {
      id: '2',
      amount: 15000000, // 150,000 UZS
      method: 'card',
      status: 'PENDING',
      requestedAt: '2024-01-18T11:00:00Z',
      accountRef: '**** **** **** 5678',
    },
  ];

  const wallet = walletData || mockWalletData;
  const entries = entriesData?.entries || mockEntries;
  const payouts = mockPayouts; // TODO: Replace with real API

  const handlePayoutRequest = async () => {
    const amountInKopeks = parseFloat(payoutAmount) * 100;
    const validation = validateUZSAmount(
      amountInKopeks,
      PRICE_CONSTANTS.MIN_PAYOUT_AMOUNT,
      wallet.availableAmount
    );

    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    if (!accountDetails.trim()) {
      toast.error('Hisob ma\'lumotlarini kiriting');
      return;
    }

    try {
      await requestPayoutMutation.mutateAsync({
        amount: amountInKopeks,
        method: payoutMethod,
        accountRef: accountDetails,
        note: payoutNote,
      });

      setShowPayoutModal(false);
      setPayoutAmount('');
      setAccountDetails('');
      setPayoutNote('');
      toast.success('To\'lov so\'rovi yuborildi');
    } catch (error: any) {
      toast.error(error.message || 'To\'lov so\'rovi yuborilmadi');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; icon: React.ReactNode }> = {
      PENDING: {
        variant: 'secondary',
        label: 'Kutilmoqda',
        icon: <Clock className="h-3 w-3" />,
      },
      AVAILABLE: {
        variant: 'default',
        label: 'Mavjud',
        icon: <CheckCircle className="h-3 w-3" />,
      },
      PAID: {
        variant: 'outline',
        label: 'To\'langan',
        icon: <CheckCircle className="h-3 w-3" />,
      },
      APPROVED: {
        variant: 'default',
        label: 'Tasdiqlangan',
        icon: <CheckCircle className="h-3 w-3" />,
      },
      FAILED: {
        variant: 'destructive',
        label: 'Xatolik',
        icon: <AlertCircle className="h-3 w-3" />,
      },
      REJECTED: {
        variant: 'destructive',
        label: 'Rad etilgan',
        icon: <AlertCircle className="h-3 w-3" />,
      },
    };

    const config = variants[status] || variants.PENDING;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mavjud mablag'</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatUZS(wallet.availableAmount)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kutayotgan mablag'</p>
                <p className="text-2xl font-bold text-amber-600">
                  {formatUZS(wallet.pendingAmount)}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jami daromad</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatUZS(wallet.totalEarnings)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Tezkor amallar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Dialog open={showPayoutModal} onOpenChange={setShowPayoutModal}>
              <DialogTrigger asChild>
                <Button 
                  disabled={wallet.availableAmount < PRICE_CONSTANTS.MIN_PAYOUT_AMOUNT}
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Pul yechish
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Pul yechish so'rovi</DialogTitle>
                  <DialogDescription>
                    Mavjud mablag'ingizdan pul yechish uchun so'rov yuboring
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Miqdor (UZS)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      max={wallet.availableAmount / 100}
                      min={PRICE_CONSTANTS.MIN_PAYOUT_AMOUNT / 100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimal: {formatUZS(PRICE_CONSTANTS.MIN_PAYOUT_AMOUNT)} • 
                      Maksimal: {formatUZS(wallet.availableAmount)}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="method">To'lov usuli</Label>
                    <Select value={payoutMethod} onValueChange={(value: any) => setPayoutMethod(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Bank o'tkazmasi
                          </div>
                        </SelectItem>
                        <SelectItem value="card">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Karta
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="account">
                      {payoutMethod === 'bank_transfer' ? 'Bank hisob raqami' : 'Karta raqami'}
                    </Label>
                    <Input
                      id="account"
                      placeholder={payoutMethod === 'bank_transfer' ? '20208000000000000000' : '8600 0000 0000 0000'}
                      value={accountDetails}
                      onChange={(e) => setAccountDetails(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="note">Izoh (ixtiyoriy)</Label>
                    <Textarea
                      id="note"
                      placeholder="Qo'shimcha ma'lumot..."
                      value={payoutNote}
                      onChange={(e) => setPayoutNote(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPayoutModal(false)}
                      className="flex-1"
                    >
                      Bekor qilish
                    </Button>
                    <Button 
                      onClick={handlePayoutRequest}
                      disabled={requestPayoutMutation.isPending}
                      className="flex-1"
                    >
                      So'rov yuborish
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={() => setActiveTab('entries')}>
              <Eye className="h-4 w-4 mr-2" />
              Tranzaksiyalar
            </Button>

            <Button variant="outline" onClick={() => setActiveTab('payouts')}>
              <Calendar className="h-4 w-4 mr-2" />
              To'lov tarixi
            </Button>
          </div>

          {wallet.availableAmount < PRICE_CONSTANTS.MIN_PAYOUT_AMOUNT && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                Pul yechish uchun minimal mablag' {formatUZS(PRICE_CONSTANTS.MIN_PAYOUT_AMOUNT)} bo'lishi kerak
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderEntries = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Hamyon tranzaksiyalari</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sana</TableHead>
              <TableHead>Tavsif</TableHead>
              <TableHead>O'quvchi</TableHead>
              <TableHead>Miqdor</TableHead>
              <TableHead>Komisiya</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mavjud bo'ladi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {new Date(entry.createdAt).toLocaleDateString('uz-UZ')}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{entry.description}</div>
                    {entry.lessonSubject && (
                      <div className="text-sm text-gray-500">{entry.lessonSubject}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{entry.studentName}</TableCell>
                <TableCell className="font-medium">
                  {formatUZS(entry.amount)}
                </TableCell>
                <TableCell className="text-red-600">
                  -{formatUZS(entry.commission)}
                </TableCell>
                <TableCell>{getStatusBadge(entry.status)}</TableCell>
                <TableCell>
                  {entry.availableAt && (
                    <span className="text-sm text-gray-500">
                      {new Date(entry.availableAt).toLocaleDateString('uz-UZ')}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderPayouts = () => (
    <Card>
      <CardHeader>
        <CardTitle>To'lov so'rovlari tarixi</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sana</TableHead>
              <TableHead>Miqdor</TableHead>
              <TableHead>Usul</TableHead>
              <TableHead>Hisob</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Qayta ishlandi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell>
                  {new Date(payout.requestedAt).toLocaleDateString('uz-UZ')}
                </TableCell>
                <TableCell className="font-medium">
                  {formatUZS(payout.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {payout.method === 'bank_transfer' ? (
                      <Building className="h-4 w-4" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                    {payout.method === 'bank_transfer' ? 'Bank' : 'Karta'}
                  </div>
                </TableCell>
                <TableCell className="font-mono">
                  {payout.accountRef}
                </TableCell>
                <TableCell>{getStatusBadge(payout.status)}</TableCell>
                <TableCell>
                  {payout.processedAt && (
                    <span className="text-sm text-gray-500">
                      {new Date(payout.processedAt).toLocaleDateString('uz-UZ')}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Umumiy ko\'rinish', icon: Wallet },
          { id: 'entries', label: 'Tranzaksiyalar', icon: DollarSign },
          { id: 'payouts', label: 'To\'lovlar', icon: ArrowUpRight },
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeTab === id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(id as any)}
            className={cn(
              "flex items-center gap-2",
              activeTab === id && "bg-white shadow-sm"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'entries' && renderEntries()}
      {activeTab === 'payouts' && renderPayouts()}
    </div>
  );
};
