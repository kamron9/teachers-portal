import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageThreadList } from '@/components/messaging/MessageThreadList';
import { ChatWindow } from '@/components/messaging/ChatWindow';
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  MessageCircle, 
  Users,
  Phone,
  Video,
  UserPlus,
  Search
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { cn } from "@/lib/utils";

interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  role: 'student' | 'teacher';
}

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    searchParams.get('thread') || null
  );
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Update URL when thread selection changes
  useEffect(() => {
    if (selectedThreadId) {
      setSearchParams({ thread: selectedThreadId });
    } else {
      setSearchParams({});
    }
  }, [selectedThreadId, setSearchParams]);

  // Mock function to get user details for selected thread
  // In real app, this would come from the thread data
  useEffect(() => {
    if (selectedThreadId) {
      // Mock user data - in real app, get from thread data
      setSelectedUser({
        id: '2',
        firstName: 'Aziza',
        lastName: 'Karimova',
        avatar: '/placeholder.svg',
        isOnline: true,
        role: 'teacher',
      });
    }
  }, [selectedThreadId]);

  const handleThreadSelect = (threadId: string) => {
    setSelectedThreadId(threadId);
  };

  const handleBack = () => {
    setSelectedThreadId(null);
    setSelectedUser(null);
  };

  const handleNewMessage = () => {
    // Navigate to teacher/student search for new conversation
    navigate('/teachers');
  };

  const handleCallStart = (type: 'audio' | 'video') => {
    // TODO: Implement call functionality
  };

  const handleUserInfo = () => {
    if (selectedUser) {
      // Navigate to user profile
      if (selectedUser.role === 'teacher') {
        navigate(`/teacher/${selectedUser.id}`);
      } else {
        navigate(`/student/${selectedUser.id}`);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Kirish talab qilinadi
          </h1>
          <p className="text-gray-600 mb-6">
            Xabarlarni ko'rish uchun tizimga kirishingiz kerak.
          </p>
          <Button onClick={() => navigate('/login')}>
            Tizimga kirish
          </Button>
        </div>
      </div>
    );
  }

  // Mobile view - show only thread list or chat window
  if (isMobileView) {
    return (
      <div className="min-h-screen bg-gray-50">
        {selectedThreadId && selectedUser ? (
          <ChatWindow
            threadId={selectedThreadId}
            otherUser={selectedUser}
            currentUserId={user.id}
            onBack={handleBack}
            onCallStart={handleCallStart}
            onUserInfo={handleUserInfo}
            className="h-screen"
          />
        ) : (
          <div className="h-screen">
            {/* Mobile Header */}
            <div className="bg-white border-b p-4 flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-semibold">Xabarlar</h1>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNewMessage}
                className="p-2"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>

            <MessageThreadList
              currentUserId={user.id}
              selectedThreadId={selectedThreadId}
              onThreadSelect={handleThreadSelect}
              onNewMessage={handleNewMessage}
              className="h-[calc(100vh-73px)]"
            />
          </div>
        )}
      </div>
    );
  }

  // Desktop view - show both panels
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Orqaga
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Xabarlar</h1>
                <p className="text-gray-600">
                  O'qituvchilar va o'quvchilar bilan muloqot qiling
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6 h-[800px]">
            {/* Thread List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border h-full">
                <MessageThreadList
                  currentUserId={user.id}
                  selectedThreadId={selectedThreadId}
                  onThreadSelect={handleThreadSelect}
                  onNewMessage={handleNewMessage}
                  className="h-full rounded-lg"
                />
              </div>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border h-full">
                {selectedThreadId && selectedUser ? (
                  <ChatWindow
                    threadId={selectedThreadId}
                    otherUser={selectedUser}
                    currentUserId={user.id}
                    onCallStart={handleCallStart}
                    onUserInfo={handleUserInfo}
                    className="h-full rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <MessageCircle className="h-12 w-12 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      Suhbatni tanlang
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Chap tarafdan suhbatni tanlang yoki yangi xabar yuboring
                    </p>
                    <div className="flex gap-3">
                      <Button onClick={handleNewMessage}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Yangi xabar
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/teachers')}>
                        <Search className="h-4 w-4 mr-2" />
                        O'qituvchi topish
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
