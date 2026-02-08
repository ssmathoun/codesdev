import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
  
    if (loading) {
      return <div className="h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#dc2626] border-t-transparent rounded-full animate-spin" />
      </div>;
    }
  
    if (!user) {
      return <Navigate to="/login" replace />;
    }
  
    return <>{children}</>;
  }