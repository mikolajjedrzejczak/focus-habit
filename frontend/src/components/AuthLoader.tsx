// src/components/common/AuthLoader.tsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth.store.js';
import { refreshRequest } from '../services/auth.service.js';
import { LoadingSpinner } from './common/LoadingSpinner.js';

interface Props {
  children: React.ReactNode;
}

const AuthLoader = ({ children }: Props) => {
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await refreshRequest();
        const { accessToken, user } = response.data;

        login(accessToken, user);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [login]);

  if (isLoading) {
    return <LoadingSpinner size="lg" variant="fullScreen" />;
  }

  return <>{children}</>;
};

export default AuthLoader;
