import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CheckCheck, Clock, Download, FileText, Image, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface Attachment {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  size?: number;
}

interface MessageBubbleProps {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  createdAt: string;
  isOwnMessage: boolean;
  status: 'SENT' | 'DELIVERED' | 'READ';
  attachments?: Attachment[];
  isTyping?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  id,
  content,
  senderId,
  senderName,
  senderAvatar,
  createdAt,
  isOwnMessage,
  status,
  attachments = [],
  isTyping = false,
}) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'SENT':
        return <Check className="h-3 w-3" />;
      case 'DELIVERED':
        return <CheckCheck className="h-3 w-3" />;
      case 'READ':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const renderAttachment = (attachment: Attachment) => {
    const getFileIcon = () => {
      switch (attachment.type) {
        case 'image':
          return <Image className="h-4 w-4" />;
        case 'video':
          return <Video className="h-4 w-4" />;
        default:
          return <FileText className="h-4 w-4" />;
      }
    };

    const formatFileSize = (bytes?: number) => {
      if (!bytes) return '';
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
      <div key={attachment.id} className="mt-2">
        {attachment.type === 'image' ? (
          <div className="relative group">
            <img 
              src={attachment.url} 
              alt={attachment.name}
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(attachment.url, '_blank')}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white hover:bg-black/70"
              onClick={() => window.open(attachment.url, '_blank')}
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        ) : attachment.type === 'video' ? (
          <div className="relative">
            <video 
              src={attachment.url}
              controls
              className="max-w-xs rounded-lg"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg max-w-xs cursor-pointer hover:bg-gray-200 transition-colors"
               onClick={() => window.open(attachment.url, '_blank')}>
            {getFileIcon()}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{attachment.name}</div>
              {attachment.size && (
                <div className="text-xs text-gray-500">{formatFileSize(attachment.size)}</div>
              )}
            </div>
            <Download className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
    );
  };

  if (isTyping) {
    return (
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="text-xs">
            {senderName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="bg-gray-100 rounded-2xl px-4 py-2 max-w-xs">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1 ml-2">typing...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-start gap-3 mb-4",
      isOwnMessage && "flex-row-reverse"
    )}>
      {!isOwnMessage && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="text-xs">
            {senderName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-xs lg:max-w-md",
        isOwnMessage && "items-end"
      )}>
        {!isOwnMessage && (
          <div className="text-xs text-gray-600 mb-1 ml-2">{senderName}</div>
        )}
        
        <div className={cn(
          "rounded-2xl px-4 py-2 break-words",
          isOwnMessage 
            ? "bg-primary text-primary-foreground" 
            : "bg-gray-100 text-gray-900"
        )}>
          {content && <div className="whitespace-pre-wrap">{content}</div>}
          {attachments.map(renderAttachment)}
        </div>
        
        <div className={cn(
          "flex items-center gap-1 mt-1 text-xs text-gray-500",
          isOwnMessage ? "flex-row-reverse" : "ml-2"
        )}>
          <span>{formatTime(createdAt)}</span>
          {isOwnMessage && (
            <div className="flex items-center">
              {getStatusIcon()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
