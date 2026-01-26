
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import AppRouter from './router/router';

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="mt-4 text-gray-600 text-lg">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return <AppRouter />;
}

export default App;