import React, { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Image, Video, FileText, X, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface Attachment {
  id: string;
  file: File;
  type: 'image' | 'video' | 'document';
  preview?: string;
}

interface MessageInputProps {
  onSendMessage: (content: string, attachments: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  onTyping?: (isTyping: boolean) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Xabar yozing...",
  disabled = false,
  maxLength = 1000,
  onTyping,
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleInputChange = useCallback((value: string) => {
    setMessage(value);
    
    // Handle typing indicator
    if (onTyping) {
      onTyping(true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    }
  }, [onTyping]);

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    
    if ((trimmedMessage || attachments.length > 0) && !isLoading) {
      onSendMessage(trimmedMessage, attachments.map(a => a.file));
      setMessage('');
      setAttachments([]);
      
      // Stop typing indicator
      if (onTyping) {
        onTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [message, attachments, isLoading, onSendMessage, onTyping]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleFileSelect = useCallback((type: 'image' | 'video' | 'document') => {
    const input = fileInputRef.current;
    if (!input) return;

    const acceptTypes = {
      image: 'image/*',
      video: 'video/*',
      document: '.pdf,.doc,.docx,.txt,.rtf',
    };

    input.accept = acceptTypes[type];
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach(file => {
          const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
          const attachment: Attachment = {
            id,
            file,
            type,
          };

          // Create preview for images
          if (type === 'image') {
            const reader = new FileReader();
            reader.onload = (e) => {
              setAttachments(prev => prev.map(a => 
                a.id === id ? { ...a, preview: e.target?.result as string } : a
              ));
            };
            reader.readAsDataURL(file);
          }

          setAttachments(prev => [...prev, attachment]);
        });
      }
      setShowAttachmentMenu(false);
    };
    input.click();
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  }, []);

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="border-t bg-white p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="relative group">
              {attachment.type === 'image' && attachment.preview ? (
                <div className="relative">
                  <img 
                    src={attachment.preview} 
                    alt={attachment.file.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 pr-8 relative">
                  {getFileIcon(attachment.type)}
                  <div>
                    <div className="text-sm font-medium truncate max-w-24">
                      {attachment.file.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(attachment.file.size)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="w-9 h-9 p-0"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          {/* Attachment Menu */}
          {showAttachmentMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-2 z-10">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleFileSelect('image')}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Rasm
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleFileSelect('video')}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleFileSelect('document')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Hujjat
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            maxLength={maxLength}
            rows={1}
            className="min-h-[40px] max-h-32 resize-none pr-12"
            style={{
              height: 'auto',
              overflowY: message.split('\n').length > 3 ? 'scroll' : 'hidden',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 128) + 'px';
            }}
          />
          
          {/* Character counter */}
          {message.length > maxLength * 0.8 && (
            <div className={cn(
              "absolute bottom-2 right-2 text-xs",
              message.length >= maxLength ? "text-red-500" : "text-gray-500"
            )}>
              {message.length}/{maxLength}
            </div>
          )}
        </div>

        <Button
          onClick={handleSend}
          disabled={(!message.trim() && attachments.length === 0) || isLoading || disabled}
          size="sm"
          className="w-9 h-9 p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
      />
    </div>
  );
};
