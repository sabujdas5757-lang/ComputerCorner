import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { checkIfAdmin } from '../utils/admin';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!checkIfAdmin(user?.email)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
