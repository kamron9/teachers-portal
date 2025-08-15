import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Index from "./pages/Index";
import Teachers from "./pages/Teachers";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherDetails from "./pages/TeacherDetails";
import TeacherRegister from "./pages/TeacherRegister";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherSchedule from "./pages/TeacherSchedule";
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

const queryClient = new QueryClient();

const App = () => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {!isAdminRoute && <Header />}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teacher/:id" element={<TeacherDetails />} />
          <Route path="/tutor/:id" element={<TeacherDetails />} />
          <Route path="/teacher-profile" element={<TeacherProfile />} />
          <Route path="/teacher-register" element={<TeacherRegister />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher-schedule" element={<TeacherSchedule />} />
          <Route path="/student-register" element={<StudentRegister />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-reviews" element={<StudentReviews />} />
          <Route path="/student-payments" element={<StudentPayments />} />
          <Route path="/book-lesson/:teacherId" element={<BookLesson />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/review/:lessonId" element={<ReviewTeacher />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-users" element={<AdminUsers />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/search" element={<Search />} />
          <Route path="/find-teachers/:subject" element={<FindTeachers />} />
          <Route path="/booking" element={<Booking />} />
          <Route
            path="/how-it-works"
            element={
              <PlaceholderPage
                title="How It Works"
                description="Learn how our platform connects students with expert teachers for effective online learning."
              />
            }
          />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<StudentRegister />} />
          <Route path="/auth/register" element={<StudentRegister />} />
          <Route path="/teacher-signup" element={<TeacherRegister />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
