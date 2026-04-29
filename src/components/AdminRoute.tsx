import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  const admins = ['computercorner@gmail.com', 'sabujdas5757@gmail.com'];

  if (!user || !admins.includes(user.email || '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
