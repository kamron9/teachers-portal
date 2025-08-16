import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Archive,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSocket } from '@/contexts/SocketContext';
import { useSendMessage, useMessageThread } from '@/hooks/useApi';

interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  role: 'student' | 'teacher';
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  attachments?: Array<{
    id: string;
    type: 'image' | 'video' | 'document';
    url: string;
    name: string;
    size?: number;
  }>;
  createdAt: string;
}

interface ChatWindowProps {
  threadId: string;
  otherUser: ChatUser;
  currentUserId: string;
  onBack?: () => void;
  onCallStart?: (type: 'audio' | 'video') => void;
  onUserInfo?: () => void;
  className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  threadId,
  otherUser,
  currentUserId,
  onBack,
  onCallStart,
  onUserInfo,
  className,
}) => {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();

  // Fetch message thread data
  const { 
    data: threadData, 
    isLoading, 
    error 
  } = useMessageThread(threadId);

  const sendMessageMutation = useSendMessage();

  const messages: Message[] = threadData?.messages || [];

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    // Join the thread room
    socket.emit('join_thread', threadId);

    // Listen for new messages
    const handleNewMessage = (message: Message) => {
      // Message will be updated through React Query
      scrollToBottom();
    };

    // Listen for typing events
    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== currentUserId) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      }
    };

    // Listen for message status updates
    const handleMessageStatus = (data: { messageId: string; status: string }) => {
      // Update message status through React Query
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('message_status', handleMessageStatus);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('message_status', handleMessageStatus);
      socket.emit('leave_thread', threadId);
    };
  }, [socket, threadId, currentUserId, scrollToBottom]);

  // Handle typing indicator
  const handleTyping = useCallback((typing: boolean) => {
    setIsTyping(typing);
    if (socket) {
      socket.emit('typing', { threadId, isTyping: typing });
    }
  }, [socket, threadId]);

  // Handle sending messages
  const handleSendMessage = useCallback(async (content: string, attachments: File[]) => {
    try {
      await sendMessageMutation.mutateAsync({
        threadId,
        content,
        attachments,
      });
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [threadId, sendMessageMutation, scrollToBottom]);

  const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return '';
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'hozir';
    if (diffMins < 60) return `${diffMins} daqiqa oldin`;
    if (diffHours < 24) return `${diffHours} soat oldin`;
    if (diffDays < 7) return `${diffDays} kun oldin`;
    return date.toLocaleDateString('uz-UZ');
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full text-center p-6", className)}>
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Xabarlarni yuklashda xatolik</h3>
        <p className="text-gray-600 mb-4">Iltimos, sahifani yangilang yoki keyinroq urinib ko'ring</p>
        <Button onClick={() => window.location.reload()}>
          Sahifani yangilash
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={onUserInfo}>
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={otherUser.avatar} alt={`${otherUser.firstName} ${otherUser.lastName}`} />
                <AvatarFallback>
                  {otherUser.firstName[0]}{otherUser.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {otherUser.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">
                {otherUser.firstName} {otherUser.lastName}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {otherUser.role === 'teacher' ? 'O\'qituvchi' : 'O\'quvchi'}
                </Badge>
                <span className="text-sm text-gray-500">
                  {otherUser.isOnline ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Onlayn
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatLastSeen(otherUser.lastSeen)}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onCallStart && otherUser.isOnline && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onCallStart('audio')}
                className="p-2"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onCallStart('video')}
                className="p-2"
              >
                <Video className="h-4 w-4" />
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onUserInfo && (
                <DropdownMenuItem onClick={onUserInfo}>
                  <Info className="h-4 w-4 mr-2" />
                  Profil ko'rish
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                Arxivlash
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Shikoyat qilish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Archive className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Xabarlar yo'q</h3>
            <p className="text-gray-600 mb-4">
              {otherUser.firstName} bilan birinchi xabaringizni yuboring
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                id={message.id}
                content={message.content}
                senderId={message.senderId}
                senderName={message.senderId === currentUserId 
                  ? 'Siz' 
                  : `${otherUser.firstName} ${otherUser.lastName}`
                }
                senderAvatar={message.senderId === currentUserId 
                  ? undefined 
                  : otherUser.avatar
                }
                createdAt={message.createdAt}
                isOwnMessage={message.senderId === currentUserId}
                status={message.status}
                attachments={message.attachments}
              />
            ))}
            
            {/* Typing indicator */}
            {typingUsers.size > 0 && (
              <MessageBubble
                id="typing"
                content=""
                senderId={otherUser.id}
                senderName={`${otherUser.firstName} ${otherUser.lastName}`}
                senderAvatar={otherUser.avatar}
                createdAt=""
                isOwnMessage={false}
                status="SENT"
                isTyping={true}
              />
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={sendMessageMutation.isPending}
        onTyping={handleTyping}
        placeholder={`${otherUser.firstName}ga xabar yozing...`}
      />
    </div>
  );
};
