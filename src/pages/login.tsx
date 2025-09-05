import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Building2, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/lib/validation';

type UserType = 'Retiree' | 'Startup';

// Helper function to determine redirect path (shared between login and signup)
const getRedirectPath = (
  userType: UserType | undefined,
  hasEmptyData: boolean | undefined,
): string => {
  if (userType === 'Retiree') {
    return hasEmptyData ? '/retiree/profile/edit' : '/retiree/browse-jobs';
  } else if (userType === 'Startup') {
    return hasEmptyData ? '/startup/profile/edit' : '/startup/browse-retirees';
  }
  return '/';
};

interface LoginResponse {
  redirect?: boolean;
  userType?: UserType;
  hasEmptyData?: boolean;
}

interface ErrorResponse {
  redirectToSignup?: boolean;
  message?: string;
  error?: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check for error in URL params (from failed magic link)
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  // Email validation on change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear email error when user starts typing
    if (emailError) {
      setEmailError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email before submitting
    if (!email) {
      setEmailError('Email address is required');
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);
    setEmailError(null);

    try {
      const apiBase = String(import.meta.env.VITE_API_BASE_URL ?? '');
      const res = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = (await res.json()) as ErrorResponse;

        if (errorData.redirectToSignup) {
          setError(errorData.message ?? 'This email is not registered. Please sign up first.');
        }

        throw new Error(errorData.error ?? 'Error sending magic link');
      }

      const data = (await res.json()) as LoginResponse;

      if (data.redirect === true) {
        await new Promise((resolve) => setTimeout(resolve, 100));

        await refreshUser();

        const redirectPath = getRedirectPath(data.userType, data.hasEmptyData);

        navigate(redirectPath);
        return;
      }
      setShowEmailSent(true);
      setSentEmail(email);
      setEmail('');
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login to WiseUp and discover opportunities." />
      </Helmet>
      <div className="min-h-screen flex items-start justify-center p-4 pt-16">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Hero Section */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Welcome back to WiseUp
              </h2>
              <p className="text-l text-muted-foreground leading-relaxed">
                Sign in to continue building meaningful connections. Whether you're exploring
                opportunities or managing your network, we're here to help you succeed.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Retiree info card */}
              <div className="flex items-start space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
                <div className="h-12 w-12 bg-white rounded-xl  border border-primary flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-2">
                    For Experienced Retirees
                  </h3>
                  <p className="text-muted-foreground text-l">
                    Discover exciting opportunities with innovative startups that value your
                    expertise and experience.
                  </p>
                </div>
              </div>
              {/* Startup info card */}
              <div className="flex items-start space-x-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
                <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-2">
                    For Innovative Startups
                  </h3>
                  <p className="text-muted-foreground text-l">
                    Access a curated network of experienced retirees ready to help you scale and
                    succeed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8 pt-8">
                <div className="mx-auto mb-6 flex flex-row gap-4 items-center justify-center">
                  <div className="flex h-16 w-16 bg-white border border-primary items-center justify-center rounded-2xl">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back
                </CardTitle>
                <p className="text-gray-600 text-l">Sign in to access your account</p>
              </CardHeader>

              <CardContent className="space-y-8 px-8 pb-8">
                {showEmailSent && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm">
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-green-800 font-semibold text-lg">Magic Link sent!</h3>
                    </div>
                    <p className="text-green-700 text-base mb-3">
                      We've sent a secure magic link to{' '}
                      <strong className="text-green-800">{sentEmail}</strong>.
                    </p>
                    <p className="text-green-600 text-sm mb-4">
                      Click the link in your email to sign in. It expires in 15 minutes.
                    </p>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    void handleSubmit(e);
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="text"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email address"
                      className={`w-full h-12 px-4 text-base border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        emailError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-primary hover:bg-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base cursor-pointer transform transition-transform duration-200 ease-out hover:scale-[1.03] hover:bg-primary group"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending magic link...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Login
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </div>
                    )}
                  </Button>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                  )}
                </form>

                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-base">
                    New to WiseUp?{' '}
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        navigate('/signup');
                      }}
                      className="cursor-pointer text-primary hover:text-primary p-0 h-auto font-semibold text-base underline-offset-4 cursor-pointer"
                    >
                      Create an account
                    </Button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
