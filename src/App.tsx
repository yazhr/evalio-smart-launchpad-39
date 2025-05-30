
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ChatAssistant from "./pages/ChatAssistant";

const queryClient = new QueryClient();

// Protected route component that redirects to home if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Show loading state if auth is still being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!user) {
    console.log("No user found, redirecting to home");
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Redirect to dashboard if already authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Show loading state if auth is still being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (user) {
    console.log("User found, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
