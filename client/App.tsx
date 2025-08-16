import "./global.css";

import React from "react";

export default function App() {
  console.log("App component rendering");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tutoring Marketplace</h1>
      <p>App is loading successfully!</p>
    </div>
  );
}
import Index from "./pages/Index";
import Teachers from "./pages/Teachers";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherDetails from "./pages/TeacherDetails";
import TeacherRegister from "./pages/TeacherRegister";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherSchedule from "./pages/TeacherSchedule";
import TeacherAvailability from "./pages/TeacherAvailability";
import TeacherSubjects from "./pages/TeacherSubjects";
import StudentRegister from "./pages/StudentRegister";
import StudentProfile from "./pages/StudentProfile";
import StudentDashboard from "./pages/StudentDashboard";
import StudentReviews from "./pages/StudentReviews";
import StudentPayments from "./pages/StudentPayments";
import BookLesson from "./pages/BookLesson";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import ReviewTeacher from "./pages/ReviewTeacher";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import Login from "./pages/Login";
import Subjects from "./pages/Subjects";
import FindTeachers from "./pages/FindTeachers";
import Search from "./pages/Search";
import Booking from "./pages/Booking";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

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
          {!isAdminRoute && <Header />}
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
            <Route
              path="/teacher-availability"
              element={
                <ProtectedRoute roles={["TEACHER"]}>
                  <TeacherAvailability />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher-subjects"
              element={
                <ProtectedRoute roles={["TEACHER"]}>
                  <TeacherSubjects />
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

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
