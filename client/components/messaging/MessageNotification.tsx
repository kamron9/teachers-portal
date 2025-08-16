import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { useSocket } from '@/contexts/SocketContext';
import { useMessageThreads } from '@/hooks/useApi';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface MessageNotificationProps {
  currentUserId: string;
  variant?: 'header' | 'dashboard' | 'sidebar';
  className?: string;
}

export const MessageNotification: React.FC<MessageNotificationProps> = ({
  currentUserId,
  variant = 'header',
  className,
}) => {
  const { socket, isConnected } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Fetch threads to get initial unread count
  const { data: threadsData } = useMessageThreads(currentUserId);

  // Calculate unread count from threads
  useEffect(() => {
    if (threadsData?.threads) {
      const totalUnread = threadsData.threads.reduce(
        (total, thread) => total + thread.unreadCount, 
        0
      );
      setUnreadCount(totalUnread);
    }
  }, [threadsData]);

  // Listen for real-time message updates
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: any) => {
      // Only increment if message is not from current user
      if (data.senderId !== currentUserId) {
        setUnreadCount(prev => prev + 1);
      }
    };

    const handleMessageRead = (data: any) => {
      // Decrement unread count when messages are read
      setUnreadCount(prev => Math.max(0, prev - (data.count || 1)));
    };

    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessageRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessageRead);
    };
  }, [socket, currentUserId]);

  const getButtonContent = () => {
    switch (variant) {
      case 'header':
        return (
          <Button variant="ghost" size="sm" className={cn("relative", className)}>
            <MessageCircle className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        );
      
      case 'dashboard':
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className={cn("relative", className)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Xabarlar
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="ml-2 h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        );
      
      case 'sidebar':
        return (
          <div className={cn("flex items-center justify-between w-full", className)}>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5" />
              <span>Xabarlar</span>
            </div>
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </div>
        );
      
      default:
        return (
          <MessageCircle className="h-4 w-4" />
        );
    }
  };

  return (
    <Link to="/messages" className={className}>
      {getButtonContent()}
    </Link>
  );
};
