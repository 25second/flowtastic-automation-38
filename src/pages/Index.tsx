
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

const Index = () => {
  const { session } = useAuth();

  // If user is authenticated, redirect to dashboard, otherwise to auth page
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/auth" replace />;
};

export default Index;
