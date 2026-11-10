import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import logoImage from "../../imports/logo-1.jpg";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login with:", { email, password });
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-8">
      {/* Header / Logo Section */}
      <div className="flex flex-col items-center pt-4 pb-8">
        {/* Logo Image */}
        <div className="w-full flex justify-center">
          <img
            src={logoImage}
            alt="GrabMeFood Logo"
            className="w-full max-w-md h-auto object-contain"
          />
        </div>
      </div>

      {/* Login Form Container */}
      <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 px-6 py-8 flex-1 flex flex-col">
        {/* Social Login Buttons */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialLogin("Google")}
            className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-gray-300 hover:shadow-md transition-all active:scale-95"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={() => handleSocialLogin("Facebook")}
            className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center hover:bg-[#1565C0] hover:shadow-md transition-all active:scale-95"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>

          {/* X (Twitter) */}
          <button
            type="button"
            onClick={() => handleSocialLogin("X")}
            className="w-14 h-14 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 hover:shadow-md transition-all active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-gray-500 text-sm">hoặc</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex-1 flex flex-col">
          {/* Account Field */}
          <div className="mb-4">
            <div className="flex items-center gap-3 pb-2 border-b-2 border-gray-300 focus-within:border-red-600 transition-colors">
              <div className="w-6 h-6 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tài khoản"
                className="flex-1 bg-transparent outline-none text-black placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <div className="flex items-center gap-3 pb-2 border-b-2 border-gray-300 focus-within:border-red-600 transition-colors">
              <div className="w-6 h-6 flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className="flex-1 bg-transparent outline-none text-black placeholder:text-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center justify-between mb-8 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
              />
              <span className="text-gray-600">Nhớ tài khoản</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-gray-600 hover:text-red-600 transition-colors underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-4 rounded-full hover:bg-red-700 transition-all active:scale-[0.98] shadow-lg hover:shadow-xl mb-4"
          >
            Đăng nhập
          </button>

          {/* Register Link */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" className="text-red-600 font-medium hover:underline">
                Tạo tài khoản
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-gray-500 mt-auto">
            Bằng cách đăng nhập / đăng ký bạn đồng ý với{" "}
            <Link to="/terms" className="text-red-600 underline">
              điều khoản
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}