import { useAuthStore } from '../store/auth.store.js';
import { Navigate, Outlet } from 'react-router-dom';

export const PublicRoute = () => {
  const isAuth = useAuthStore((state) => state.isAuth());

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
