import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  MoreVertical,
  Calendar,
  CreditCard,
  MessageCircle,
  Star,
  Users,
  AlertTriangle,
  Info,
  CheckCircle,
  Settings,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatUZS } from "@/lib/currency";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "@/hooks/useApi";
import { toast } from "sonner";

interface Notification {
  id: string;
  type:
    | "BOOKING_CREATED"
    | "BOOKING_CONFIRMED"
    | "BOOKING_CANCELLED"
    | "LESSON_REMINDER"
    | "PAYMENT_RECEIVED"
    | "PAYOUT_APPROVED"
    | "MESSAGE_RECEIVED"
    | "REVIEW_RECEIVED";
  title: string;
  content: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  className,
}) => {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    data: notificationsData,
    isLoading,
    refetch,
  } = useNotifications({
    isRead: filter === "all" ? undefined : filter === "read",
    type: typeFilter === "all" ? undefined : typeFilter,
    page: 1,
    limit: 50,
  });

  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const notifications: Notification[] = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  const notificationTypes = [
    { value: "all", label: "Barchasi" },
    { value: "BOOKING_CREATED", label: "Yangi dars" },
    { value: "BOOKING_CONFIRMED", label: "Dars tasdiqlandi" },
    { value: "BOOKING_CANCELLED", label: "Dars bekor qilindi" },
    { value: "LESSON_REMINDER", label: "Dars eslatmasi" },
    { value: "PAYMENT_RECEIVED", label: "To'lov olindi" },
    { value: "PAYOUT_APPROVED", label: "To'lov tasdiqlandi" },
    { value: "MESSAGE_RECEIVED", label: "Yangi xabar" },
    { value: "REVIEW_RECEIVED", label: "Yangi sharh" },
  ];

  const getNotificationIcon = (type: string) => {
    const icons = {
      BOOKING_CREATED: Calendar,
      BOOKING_CONFIRMED: CheckCircle,
      BOOKING_CANCELLED: AlertTriangle,
      LESSON_REMINDER: Bell,
      PAYMENT_RECEIVED: CreditCard,
      PAYOUT_APPROVED: CreditCard,
      MESSAGE_RECEIVED: MessageCircle,
      REVIEW_RECEIVED: Star,
    };

    const IconComponent = icons[type as keyof typeof icons] || Info;
    return IconComponent;
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      BOOKING_CREATED: "text-blue-600 bg-blue-100",
      BOOKING_CONFIRMED: "text-green-600 bg-green-100",
      BOOKING_CANCELLED: "text-red-600 bg-red-100",
      LESSON_REMINDER: "text-purple-600 bg-purple-100",
      PAYMENT_RECEIVED: "text-green-600 bg-green-100",
      PAYOUT_APPROVED: "text-green-600 bg-green-100",
      MESSAGE_RECEIVED: "text-blue-600 bg-blue-100",
      REVIEW_RECEIVED: "text-yellow-600 bg-yellow-100",
    };

    return colors[type as keyof typeof colors] || "text-gray-600 bg-gray-100";
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Hozir";
    if (diffMins < 60) return `${diffMins} daqiqa oldin`;
    if (diffHours < 24) return `${diffHours} soat oldin`;
    if (diffDays < 7) return `${diffDays} kun oldin`;

    return date.toLocaleDateString("uz-UZ");
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      refetch();
      toast.success("Barcha bildirishnomalar o'qilgan deb belgilandi");
    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotificationMutation.mutateAsync(notificationId);
      refetch();
      toast.success("Bildirishnoma o'chirildi");
    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    }
  };

  const handleBulkAction = async (action: "read" | "delete") => {
    if (selectedIds.length === 0) {
      toast.error("Hech narsa tanlanmagan");
      return;
    }

    try {
      if (action === "read") {
        for (const id of selectedIds) {
          await markAsReadMutation.mutateAsync(id);
        }
        toast.success("Tanlangan bildirishnomalar o'qilgan deb belgilandi");
      } else {
        for (const id of selectedIds) {
          await deleteNotificationMutation.mutateAsync(id);
        }
        toast.success("Tanlangan bildirishnomalar o'chirildi");
      }

      setSelectedIds([]);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    }
  };

  const toggleSelection = (notificationId: string) => {
    setSelectedIds((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId],
    );
  };

  const selectAll = () => {
    setSelectedIds(notifications.map((n) => n.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "read" && !notification.isRead) return false;
    if (filter === "unread" && notification.isRead) return false;
    if (typeFilter !== "all" && notification.type !== typeFilter) return false;
    return true;
  });

  const renderNotificationContent = (notification: Notification) => {
    const data = notification.data || {};

    switch (notification.type) {
      case "PAYMENT_RECEIVED":
        return (
          <div className="space-y-1">
            <p>{notification.content}</p>
            {data.amount && (
              <p className="text-sm font-medium text-green-600">
                Miqdor: {formatUZS(data.amount)}
              </p>
            )}
          </div>
        );

      case "BOOKING_CREATED":
      case "BOOKING_CONFIRMED":
      case "BOOKING_CANCELLED":
        return (
          <div className="space-y-1">
            <p>{notification.content}</p>
            {data.studentName && (
              <p className="text-sm text-gray-600">
                O'quvchi: {data.studentName}
              </p>
            )}
            {data.lessonDate && (
              <p className="text-sm text-gray-600">
                Sana: {new Date(data.lessonDate).toLocaleDateString("uz-UZ")}
              </p>
            )}
          </div>
        );

      default:
        return <p>{notification.content}</p>;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Bildirishnomalar
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Barchasini o'qilgan deb belgilash
                </Button>
              )}

              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Sozlamalar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {[
                { key: "all", label: "Barchasi" },
                { key: "unread", label: "O'qilmagan" },
                { key: "read", label: "O'qilgan" },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={filter === key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(key as any)}
                  className={cn(filter === key && "bg-white shadow-sm")}
                >
                  {label}
                </Button>
              ))}
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tur bo'yicha filter" />
              </SelectTrigger>
              <SelectContent>
                {notificationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600">
                  {selectedIds.length} ta tanlangan
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("read")}
                >
                  O'qilgan deb belgilash
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                  className="text-red-600"
                >
                  O'chirish
                </Button>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Bekor qilish
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bildirishnomalar yo'q
              </h3>
              <p className="text-gray-600">
                {filter === "unread"
                  ? "Hozircha o'qilmagan bildirishnomalar yo'q"
                  : "Hozircha bildirishnomalar yo'q"}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="divide-y">
                {filteredNotifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  const iconColor = getNotificationColor(notification.type);
                  const isSelected = selectedIds.includes(notification.id);

                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-gray-50 transition-colors",
                        !notification.isRead && "bg-blue-50/50",
                        isSelected && "bg-primary/5",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Selection checkbox */}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelection(notification.id)}
                          className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />

                        {/* Icon */}
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                            iconColor,
                          )}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4
                                className={cn(
                                  "text-sm font-medium text-gray-900 mb-1",
                                  !notification.isRead && "font-semibold",
                                )}
                              >
                                {notification.title}
                              </h4>

                              <div className="text-sm text-gray-600 mb-2">
                                {renderNotificationContent(notification)}
                              </div>

                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>
                                  {formatRelativeTime(notification.createdAt)}
                                </span>
                                {!notification.isRead && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Yangi
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!notification.isRead && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleMarkAsRead(notification.id)
                                    }
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    O'qilgan deb belgilash
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Archive className="h-4 w-4 mr-2" />
                                  Arxivlash
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(notification.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  O'chirish
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {notifications.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Barchasini tanlash
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Tanlovni bekor qilish
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                Jami: {filteredNotifications.length} ta bildirishnoma
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
