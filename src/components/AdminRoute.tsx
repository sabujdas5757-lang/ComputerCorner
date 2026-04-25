import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user?.email !== 'computercorner@gmail.com') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
