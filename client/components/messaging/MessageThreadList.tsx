import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MessageCircle, 
  Archive, 
  CheckCircle, 
  Clock,
  Pin,
  MoreVertical,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useMessageThreads } from '@/hooks/useApi';

interface MessageThread {
  id: string;
  studentId: string;
  teacherId: string;
  bookingId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    status: 'SENT' | 'DELIVERED' | 'READ';
  };
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: 'student' | 'teacher';
    isOnline?: boolean;
    lastSeen?: string;
  };
  unreadCount: number;
  isPinned?: boolean;
}

interface MessageThreadListProps {
  currentUserId: string;
  selectedThreadId?: string;
  onThreadSelect: (threadId: string) => void;
  onNewMessage?: () => void;
  className?: string;
}

export const MessageThreadList: React.FC<MessageThreadListProps> = ({
  currentUserId,
  selectedThreadId,
  onThreadSelect,
  onNewMessage,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');

  const { data: threadsData, isLoading, error } = useMessageThreads(currentUserId);
  const threads: MessageThread[] = threadsData?.threads || [];

  const filteredThreads = threads.filter(thread => {
    // Search filter
    if (searchQuery) {
      const fullName = `${thread.otherUser.firstName} ${thread.otherUser.lastName}`.toLowerCase();
      const lastMessageContent = thread.lastMessage?.content.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      
      if (!fullName.includes(query) && !lastMessageContent.includes(query)) {
        return false;
      }
    }

    // Status filter
    switch (filter) {
      case 'unread':
        return thread.unreadCount > 0;
      case 'archived':
        return !thread.isActive;
      case 'all':
      default:
        return thread.isActive;
    }
  });

  // Sort threads: pinned first, then by last message time, then unread
  const sortedThreads = filteredThreads.sort((a, b) => {
    // Pinned threads first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Then by unread count
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;

    // Finally by last message time
    const aTime = new Date(a.lastMessage?.createdAt || a.updatedAt).getTime();
    const bTime = new Date(b.lastMessage?.createdAt || b.updatedAt).getTime();
    return bTime - aTime;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) {
      // Today - show time
      return date.toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays === 1) {
      return 'Kecha';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('uz-UZ', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('uz-UZ', {
        day: '2-digit',
        month: '2-digit',
      });
    }
  };

  const getLastMessagePreview = (thread: MessageThread) => {
    if (!thread.lastMessage) {
      return 'Xabarlar yo\'q';
    }

    const { content, senderId } = thread.lastMessage;
    const isOwnMessage = senderId === currentUserId;
    const prefix = isOwnMessage ? 'Siz: ' : '';
    
    if (!content.trim()) {
      return `${prefix}Fayl yuborildi`;
    }

    const preview = content.length > 50 ? content.substring(0, 50) + '...' : content;
    return `${prefix}${preview}`;
  };

  const handleThreadAction = (threadId: string, action: 'pin' | 'archive' | 'delete') => {
    // Implement thread actions
    console.log(`Action ${action} on thread ${threadId}`);
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-4 text-center", className)}>
        <div className="text-red-500 mb-2">Xabarlarni yuklashda xatolik</div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Qayta yuklash
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Xabarlar</h2>
          {onNewMessage && (
            <Button size="sm" onClick={onNewMessage}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Yangi
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Xabarlarni qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'Barchasi', count: threads.filter(t => t.isActive).length },
            { key: 'unread', label: 'O\'qilmagan', count: threads.filter(t => t.unreadCount > 0).length },
            { key: 'archived', label: 'Arxiv', count: threads.filter(t => !t.isActive).length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={cn(
                "flex-1 px-3 py-2 text-sm rounded-md transition-colors",
                filter === key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {label}
              {count > 0 && (
                <span className="ml-1 text-xs">({count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {sortedThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'Hech narsa topilmadi' : 'Xabarlar yo\'q'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? 'Boshqa qidiruv so\'zi bilan urinib ko\'ring'
                : 'O\'qituvchi yoki o\'quvchi bilan suhbatni boshlang'
              }
            </p>
            {onNewMessage && !searchQuery && (
              <Button onClick={onNewMessage}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Yangi xabar
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {sortedThreads.map((thread) => (
              <div
                key={thread.id}
                className={cn(
                  "flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors relative",
                  selectedThreadId === thread.id && "bg-primary/5 border-r-2 border-primary"
                )}
                onClick={() => onThreadSelect(thread.id)}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="w-12 h-12">
                    <AvatarImage 
                      src={thread.otherUser.avatar} 
                      alt={`${thread.otherUser.firstName} ${thread.otherUser.lastName}`} 
                    />
                    <AvatarFallback>
                      {thread.otherUser.firstName[0]}{thread.otherUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {thread.otherUser.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className={cn(
                        "font-medium truncate",
                        thread.unreadCount > 0 ? "text-gray-900" : "text-gray-700"
                      )}>
                        {thread.otherUser.firstName} {thread.otherUser.lastName}
                      </h3>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {thread.otherUser.role === 'teacher' ? 'O\'qituvchi' : 'O\'quvchi'}
                      </Badge>
                      {thread.isPinned && (
                        <Pin className="h-3 w-3 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {thread.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(thread.lastMessage.createdAt)}
                        </span>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleThreadAction(thread.id, 'pin')}>
                            <Pin className="h-4 w-4 mr-2" />
                            {thread.isPinned ? 'Unpin' : 'Pin'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleThreadAction(thread.id, 'archive')}>
                            <Archive className="h-4 w-4 mr-2" />
                            Arxivlash
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleThreadAction(thread.id, 'delete')}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            O'chirish
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-sm truncate",
                      thread.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-600"
                    )}>
                      {getLastMessagePreview(thread)}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Message status for own messages */}
                      {thread.lastMessage?.senderId === currentUserId && (
                        <div className="flex items-center">
                          {thread.lastMessage.status === 'READ' ? (
                            <CheckCircle className="h-3 w-3 text-blue-500" />
                          ) : thread.lastMessage.status === 'DELIVERED' ? (
                            <CheckCircle className="h-3 w-3 text-gray-400" />
                          ) : (
                            <Clock className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      )}
                      
                      {/* Unread count */}
                      {thread.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground min-w-[20px] h-5 text-xs flex items-center justify-center">
                          {thread.unreadCount > 99 ? '99+' : thread.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
