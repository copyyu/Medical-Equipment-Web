import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Logo from '../../assets/logo.jpg';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error: authError, clearError } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // error state (ใช้กับ animation)
  const [hasError, setHasError] = useState(false);

  const handleSubmit = async () => {
    clearError();
    setHasError(false);

    if (!username || !password) return;

    try {
      await login({ username, password });
      navigate('/home');
    } catch {
      setHasError(true);
    }
  };

  useEffect(() => {
    if (authError) {
      setHasError(true);
    }
  }, [authError]);

  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (hasError) {
      setHasError(false);
      clearError();
    }
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (hasError) {
      setHasError(false);
      clearError();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src={Logo}
              alt="Medical Equipment Logo"
              className="w-52 h-52 object-contain animate-login-logo"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Medical Equipment
          </h1>
        </div>

        {/* Card */}
        <div
          className={`bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-login-card
            ${hasError ? 'animate-login-error' : ''}
          `}
        >
          <div className="space-y-6">

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อผู้ใช้
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={username}
                  onChange={onChangeUsername}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  disabled={isLoading}
                  placeholder="กรอกชื่อผู้ใช้"
                  className={`login-input w-full pl-11 pr-10 py-3 rounded-lg border outline-none transition
                    ${hasError
                      ? 'border-red-500'
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}
                  `}
                />
                {hasError && (
                  <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={onChangePassword}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`login-input w-full pl-11 pr-16 py-3 rounded-lg border outline-none transition
                    ${hasError
                      ? 'border-red-500'
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword
                    ? <EyeOff className="w-5 h-5" />
                    : <Eye className="w-5 h-5" />
                  }
                </button>
                {hasError && (
                  <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </div>

              {hasError && (
                <p className="mt-1 text-sm text-red-500 animate-login-error-text">
                  ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">
                  จดจำฉันไว้
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !username || !password}
              className="login-btn w-full bg-blue-600 text-white py-3 rounded-lg font-medium
                         transition-all duration-200
                         hover:bg-blue-700
                         disabled:opacity-50"
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
