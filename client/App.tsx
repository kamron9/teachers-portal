import "./global.css";
import React, { lazy, Suspense } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "./hooks/useAuth";
import Header from "./components/Header";
import { SocketProvider } from "./contexts/SocketContext";

import { PageLoading } from "./components/ui/loading";

// Lazy loaded components
const Index = lazy(() => import("./pages/Index"));
const Teachers = lazy(() => import("./pages/Teachers"));
const TeacherProfile = lazy(() => import("./pages/TeacherProfile"));
const TeacherDetails = lazy(() => import("./pages/TeacherDetails"));
const TeacherRegister = lazy(() => import("./pages/TeacherRegister"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const TeacherSchedule = lazy(() => import("./pages/TeacherSchedule"));
const StudentRegister = lazy(() => import("./pages/StudentRegister"));
const StudentProfile = lazy(() => import("./pages/StudentProfile"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const StudentReviews = lazy(() => import("./pages/StudentReviews"));
const StudentPayments = lazy(() => import("./pages/StudentPayments"));
const BookLesson = lazy(() => import("./pages/BookLesson"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Payment = lazy(() => import("./pages/Payment"));
const ReviewTeacher = lazy(() => import("./pages/ReviewTeacher"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const Login = lazy(() => import("./pages/Login"));
const Subjects = lazy(() => import("./pages/Subjects"));
const FindTeachers = lazy(() => import("./pages/FindTeachers"));
const Search = lazy(() => import("./pages/Search"));
const Booking = lazy(() => import("./pages/Booking"));
const PlaceholderPage = lazy(() => import("./pages/PlaceholderPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Messages = lazy(() => import("./pages/Messages"));

// Configure React Query client with proper defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors
        if (error?.error === "Unauthorized" || error?.error === "Forbidden") {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes default
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const App = () => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            {!isAdminRoute && <Header />}
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/teacher/:id" element={<TeacherDetails />} />
            <Route path="/tutor/:id" element={<TeacherDetails />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/search" element={<Search />} />
            <Route path="/find-teachers/:subject" element={<FindTeachers />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<StudentRegister />} />
            <Route path="/auth/register" element={<StudentRegister />} />
            <Route path="/teacher-register" element={<TeacherRegister />} />
            <Route path="/teacher-signup" element={<TeacherRegister />} />
            <Route
              path="/how-it-works"
              element={
                <PlaceholderPage
                  title="How It Works"
                  description="Learn how our platform connects students with expert teachers for effective online learning."
                />
              }
            />

            {/* Teacher-only routes */}
            <Route
              path="/teacher-profile"
              element={
                <ProtectedRoute roles={["TEACHER"]}>
                  <TeacherProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher-dashboard"
              element={
                <ProtectedRoute roles={["TEACHER"]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher-schedule"
              element={
                <ProtectedRoute roles={["TEACHER"]}>
                  <TeacherSchedule />
                </ProtectedRoute>
              }
            />

            {/* Student-only routes */}
            <Route
              path="/student-profile"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-reviews"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <StudentReviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-payments"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <StudentPayments />
                </ProtectedRoute>
              }
            />

            {/* Authenticated routes (any role) */}
            <Route
              path="/book-lesson/:teacherId"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <BookLesson />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review/:lessonId"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <ReviewTeacher />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-users"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
