import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Index from "./pages/Index";
import Teachers from "./pages/Teachers";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/subjects" element={<PlaceholderPage title="Subjects" description="Browse all available subjects and find the perfect tutor for your learning goals." />} />
          <Route path="/how-it-works" element={<PlaceholderPage title="How It Works" description="Learn how our platform connects students with expert teachers for effective online learning." />} />
          <Route path="/pricing" element={<PlaceholderPage title="Pricing" description="Transparent pricing with no hidden fees. Pay as you learn with flexible payment options." />} />
          <Route path="/login" element={<PlaceholderPage title="Login" description="Sign in to your account to access your lessons and connect with teachers." />} />
          <Route path="/register" element={<PlaceholderPage title="Register" description="Create your student account and start learning with expert tutors today." />} />
          <Route path="/teacher-signup" element={<PlaceholderPage title="Become a Teacher" description="Join our community of expert educators and start teaching students worldwide." />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
