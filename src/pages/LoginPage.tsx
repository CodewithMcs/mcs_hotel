import React, { useState, useRef, useEffect } from "react";
import { Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff, ArrowLeft, KeyRound, Loader2 } from "lucide-react";

interface Props {
  setLoggedIn: (value: boolean) => void;
}

type PageView = 'login' | 'forgot-password' | 'verify-otp' | 'reset-password';

const LoginPage: React.FC<Props> = ({ setLoggedIn }) => {
  const [currentView, setCurrentView] = useState<PageView>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | null, text: string }>({ type: null, text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (currentView === 'verify-otp' && otpRefs.current[0]) {
      otpRefs.current[0]?.focus();
    }
  }, [currentView]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { valid: boolean; message: string } => {
    if (password.length < 6) {
      return { valid: false, message: "Password must be at least 6 characters" };
    }
    if (!/[A-Za-z]/.test(password)) {
      return { valid: false, message: "Password must contain at least one letter" };
    }
    return { valid: true, message: "" };
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setMessage({ type: null, text: "" });
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!email.trim() || !password) {
      setMessage({ type: 'error', text: "Please fill in all fields" });
      setIsLoading(false);
      return;
    }
    
    if (!validateEmail(email)) {
      setMessage({ type: 'error', text: "Please enter a valid email address" });
      setIsLoading(false);
      return;
    }

    if (email === "admin@gmail.com" && password === "admin123") {
      setMessage({ type: 'success', text: "Login successful! Redirecting..." });
      setTimeout(() => setLoggedIn(true), 1500);
    } else {
      setMessage({ type: 'error', text: "Invalid credentials. Please try again." });
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    setMessage({ type: null, text: "" });
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!resetEmail.trim()) {
      setMessage({ type: 'error', text: "Please enter your email address" });
      setIsLoading(false);
      return;
    }
    
    if (!validateEmail(resetEmail)) {
      setMessage({ type: 'error', text: "Please enter a valid email address" });
      setIsLoading(false);
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    console.log("Generated OTP:", otp);
    setMessage({ type: 'success', text: `OTP sent to ${resetEmail}` });
    
    setTimeout(() => {
      setCurrentView('verify-otp');
      setMessage({ type: null, text: "" });
    }, 2000);

    setIsLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (!/^\d{6}$/.test(pastedData)) {
      setMessage({ type: 'error', text: "Please paste a valid 6-digit OTP" });
      return;
    }

    const newOtp = pastedData.split('');
    setOtp(newOtp);
    otpRefs.current[5]?.focus();
    setMessage({ type: null, text: "" });
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      handleVerifyOtp();
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setMessage({ type: null, text: "" });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setMessage({ type: 'error', text: "Please enter the complete 6-digit OTP" });
      setIsLoading(false);
      return;
    }
    
    if (enteredOtp === generatedOtp) {
      setMessage({ type: 'success', text: "OTP verified successfully!" });
      setTimeout(() => {
        setCurrentView('reset-password');
        setMessage({ type: null, text: "" });
      }, 1500);
    } else {
      setMessage({ type: 'error', text: "Invalid OTP. Please try again." });
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    setMessage({ type: null, text: "" });
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: "Please fill in all fields" });
      setIsLoading(false);
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      setMessage({ type: 'error', text: passwordValidation.message });
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    setMessage({ type: 'success', text: "Password reset successful!" });
    setTimeout(() => {
      setCurrentView('login');
      setResetEmail("");
      setOtp(["", "", "", "", "", ""]);
      setGeneratedOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage({ type: 'success', text: "You can now login with your new password" });
    }, 2000);

    setIsLoading(false);
  };

  const goBack = () => {
    setMessage({ type: null, text: "" });
    if (currentView === 'verify-otp') {
      setCurrentView('forgot-password');
      setOtp(["", "", "", "", "", ""]);
    } else if (currentView === 'reset-password') {
      setCurrentView('verify-otp');
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setCurrentView('login');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const renderModalContent = () => {
    switch (currentView) {
      case 'forgot-password':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
              <p className="text-gray-400 text-sm">Enter your email to receive a verification code</p>
            </div>
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleForgotPassword)}
                placeholder="Enter your email"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all border border-white border-opacity-10"
              />
            </div>
            
            <button
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        );
        
      case 'verify-otp':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
              <p className="text-gray-400 text-sm">Enter the 6-digit code sent to {resetEmail}</p>
              <p className="text-purple-400 text-xs mt-2">You can paste the OTP directly</p>
            </div>
            
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl bg-white bg-opacity-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white border-opacity-20 transition-all"
                />
              ))}
            </div>
            
            <button
              onClick={handleVerifyOtp}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </div>
        );
        
      case 'reset-password':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-gray-400 text-sm">Create a new secure password</p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all border border-white border-opacity-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleResetPassword)}
                  placeholder="Confirm Password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all border border-white border-opacity-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-20 -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white bg-opacity-10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white border-opacity-20">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-300 text-sm">Sign in to access your dashboard</p>
          </div>

          <div className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                placeholder="admin@gmail.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all border border-white border-opacity-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 rounded-xl bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all border border-white border-opacity-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {message.text && (
              <div className={`flex items-center gap-2 p-3 rounded-xl ${
                message.type === 'error' 
                  ? 'bg-red-500 bg-opacity-20 text-red-200 border border-red-500 border-opacity-30' 
                  : 'bg-green-500 bg-opacity-20 text-green-200 border border-green-500 border-opacity-30'
              }`}>
                {message.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-400 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 bg-white bg-opacity-10"
                />
                Remember me
              </label>
              <button 
                type="button"
                onClick={() => setCurrentView('forgot-password')} 
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </div>
      </div>

      {currentView !== 'login' && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-20 p-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md relative border border-white border-opacity-20">
            <button 
              onClick={goBack} 
              className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            {message.text && (
              <div className={`mb-6 flex items-center gap-2 p-3 rounded-xl ${
                message.type === 'error' 
                  ? 'bg-red-500 bg-opacity-20 text-red-200 border border-red-500 border-opacity-30' 
                  : 'bg-green-500 bg-opacity-20 text-green-200 border border-green-500 border-opacity-30'
              }`}>
                {message.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <p className="text-sm">{message.text}</p>
              </div>
            )}
            
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;