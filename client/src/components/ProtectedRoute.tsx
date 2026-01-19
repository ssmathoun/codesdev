import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  // Wait for the /api/me handshake to complete
  if (loading) {
    return (
      <div className="h-screen w-screen bg-ide-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-ide-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If handshake fails (no valid cookie), go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}