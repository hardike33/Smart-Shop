import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { Logo } from '@/components/layout/Logo';
import { Mail, Lock, Fingerprint, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signInWithGoogle, auth, googleProvider } from '@/lib/firebase';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useApp();

  // Handle high-level redirect result when page reloads
  useEffect(() => {
    const handleResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("✅ Redirect Login Success", result.user.email);
          setUser({
            id: result.user.uid,
            name: result.user.displayName || 'Google User',
            email: result.user.email || '',
            phone: result.user.phoneNumber || '+91 98765 43210',
            dailyBudget: 200,
            avatar: result.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.user.uid}`,
            addresses: [],
            paymentMethods: [],
            notificationSettings: {
              orderUpdates: true,
              offers: true,
              reminders: true,
              sound: true,
              vibration: true,
            }
          });
          setIsLoggedIn(true);
          toast.success(`Welcome back, ${result.user.displayName}!`);
          navigate('/home');
        }
      } catch (error: any) {
        console.error("Redirect result error", error);
      }
    };
    handleResult();
  }, [navigate, setUser, setIsLoggedIn]);

  const handleGoogleRedirect = () => {
    setIsLoading(true);
    toast.info("Redirecting to Google...");
    signInWithRedirect(auth, googleProvider).catch((error: any) => {
      console.error("Redirect failed", error);
      toast.error("Redirect failed. Check your configuration.");
      setIsLoading(false);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    setUser({
      id: '1',
      name: name || 'User',
      email,
      phone: '+91 98765 43210',
      dailyBudget: 200,
      addresses: [],
      paymentMethods: [],
      notificationSettings: {
        orderUpdates: true,
        offers: true,
        reminders: true,
        sound: true,
        vibration: true,
      }
    });
    setIsLoggedIn(true);
    navigate('/home');
  };

  const handleFingerprint = () => {
    // Mock fingerprint auth
    setUser({
      id: 'f1',
      name: 'User',
      email: 'user@example.com',
      phone: '+91 98765 43210',
      dailyBudget: 200,
      addresses: [],
      paymentMethods: [],
      notificationSettings: {
        orderUpdates: true,
        offers: true,
        reminders: true,
        sound: true,
        vibration: true,
      }
    });
    setIsLoggedIn(true);
    navigate('/home');
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const googleUser = await signInWithGoogle();
      setUser({
        id: googleUser.uid,
        name: googleUser.displayName || 'Google User',
        email: googleUser.email || '',
        phone: googleUser.phoneNumber || '+91 98765 43210',
        dailyBudget: 200,
        avatar: googleUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${googleUser.uid}`,
        addresses: [],
        paymentMethods: [],
        notificationSettings: {
          orderUpdates: true,
          offers: true,
          reminders: true,
          sound: true,
          vibration: true,
        }
      });
      setIsLoggedIn(true);
      toast.success(`Welcome, ${googleUser.displayName || 'User'}!`);
      navigate('/home');
    } catch (error: any) {
      console.error("Google login failed", error);
      let errorMessage = "Google login failed. Please try again.";

      if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup blocked! Please allow popups for this site.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Google Sign-In is not enabled in Firebase > Authentication.";
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = `This domain (${window.location.hostname}) is not authorized in Firebase Console > Authentication > Settings.`;
      } else if (error.message) {
        errorMessage = `Error: ${error.code || 'unknown'}. Check if you added http://localhost:8080 to Authorized Domains.`;
      }

      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="pt-16 pb-8 px-8 flex flex-col items-center">
        <Logo className="mb-8 scale-150 origin-center" />
        <h1 className="text-3xl font-bold mb-2">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isLogin
            ? 'Sign in to continue ordering delicious meals'
            : 'Join us for budget-friendly meals'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-8 space-y-5">
        {!isLogin && (
          <div className="relative animate-fade-in">
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="pl-14 h-14"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
              👤
            </div>
          </div>
        )}

        <div className="relative">
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="pl-14 h-14"
            required
          />
          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="pl-14 pr-14 h-14"
            required
          />
          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {isLogin && (
          <button type="button" className="text-primary font-medium text-sm block ml-auto">
            Forgot Password?
          </button>
        )}

        <Button type="submit" size="xl" variant="gradient" className="w-full mt-6 h-14 text-lg">
          {isLogin ? 'Sign In' : 'Create Account'}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-sm font-medium">or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social Auth Options */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            size="xl"
            className="w-full h-14 border-border/60 hover:bg-accent/5 transition-all active:scale-[0.98]"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
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
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {isLoading ? 'Connecting...' : 'Continue with Google'}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-1 px-4">
            Having trouble?{' '}
            <button
              type="button"
              onClick={handleGoogleRedirect}
              className="text-primary hover:underline font-medium"
            >
              Try Redirect
            </button>
          </p>

          <Button
            type="button"
            variant="outline"
            size="xl"
            className="w-full h-14 border-border/60 hover:bg-accent/5"
            onClick={handleFingerprint}
          >
            <Fingerprint className="mr-3 h-5 w-5 text-primary" />
            Use Fingerprint
          </Button>
        </div>
      </form>

      {/* Switch mode */}
      <div className="p-8 text-center mt-auto">
        <p className="text-muted-foreground">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-semibold"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>

      {/* Terms and Conditions */}
      <div className="px-8 pb-8 text-center">
        <p className="text-xs text-muted-foreground leading-relaxed">
          By continuing, you agree to SmartShop's{' '}
          <button className="text-primary font-medium hover:underline">Terms of Service</button>
          {' '}and{' '}
          <button className="text-primary font-medium hover:underline">Privacy Policy</button>
        </p>
      </div>
    </div>
  );
}
