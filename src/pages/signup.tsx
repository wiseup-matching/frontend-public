import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  UserPlus,
  ArrowRight,
  CheckCircle,
  Users,
  Building2,
  Zap,
  Shield,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/lib/validation';

type UserType = 'Retiree' | 'Startup';

interface SignupResponse {
  redirect?: boolean;
  userType?: UserType;
  hasEmptyData?: boolean;
}

interface ErrorResponse {
  error?: string;
}

// Helper function to determine redirect path (shared between login and signup)
const getRedirectPath = (
  userType: UserType | undefined,
  hasEmptyData: boolean | undefined,
): string => {
  if (userType === 'Retiree') {
    return hasEmptyData ? '/retiree/profile/edit' : '/retiree/browse-jobs';
  }
  if (userType === 'Startup') {
    return hasEmptyData ? '/startup/profile/edit' : '/startup/browse-retirees';
  }
  return '/';
};

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const typeParam = params.get('type') as 'retiree' | 'startup' | null;
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Email validation on change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear email error when user starts typing
    if (emailError) {
      setEmailError(null);
    }
  };

  if (!typeParam) {
    return (
      <>
        <Helmet>
          <title>Sign Up</title>
          <meta name="description" content="Sign up to WiseUp and discover opportunities." />
        </Helmet>
        <div className="min-h-screen flex items-start justify-center p-4 pt-16">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:block space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-foreground leading-tight">
                  Where Experience meets Opportunity
                </h2>
                <p className="text-l text-muted-foreground leading-relaxed">
                  Connect with the right people at the right time. Whether you're a seasoned retiree
                  looking for your next challenge or a startup seeking exceptional talent, WiseUp
                  makes meaningful connections happen.
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

            {/* Right Side - Account Type Selection */}
            <div className="flex justify-center">
              <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-8 pt-8">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                    <UserPlus className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-foreground mb-2">
                    Join WiseUp
                  </CardTitle>
                  <p className="text-muted-foreground text-l">Tell us who you are to get started</p>
                </CardHeader>

                <CardContent className="space-y-6 px-8 pb-8">
                  <Button
                    onClick={() => {
                      navigate('/signup?type=retiree');
                    }}
                    className="w-full h-24 bg-white hover:bg-white border border-primary text-primary font-semibold rounded-2xl shadow-md hover:shadow-lg transform transition-transform duration-200 hover:scale-[1.03] group cursor-pointer"
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center">
                        <Users className="!w-6 !h-6" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-xl font-bold">Retiree</div>
                        <div className="text-sm font-normal">
                          Experienced Retirees Seeking Opportunities
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 opacity-80 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Button>

                  <Button
                    onClick={() => {
                      navigate('/signup?type=startup');
                    }}
                    className="w-full h-24 bg-primary hover:bg-primary text-primary-foreground rounded-2xl shadow-md hover:shadow-lg transform transition-transform duration-200 hover:scale-[1.03] group cursor-pointer"
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="!w-6 !h-6" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-xl font-bold">Startup</div>
                        <div className="text-sm opacity-90 font-normal">
                          Innovative Startups Seeking Talent
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 opacity-80 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Button>

                  <div className="text-center pt-6 border-t border-border">
                    <p className="text-muted-foreground text-base">
                      Already have an account?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                          navigate('/login');
                        }}
                        className="cursor-pointer text-primary hover:text-primary/90 p-0 h-auto font-semibold text-base underline-offset-4"
                      >
                        Login here
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

  const handleSignup = async (e: React.FormEvent) => {
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
    setPopup(null);
    setEmailError(null);

    try {
      const apiBase = String(import.meta.env.VITE_API_BASE_URL ?? '');
      const response = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userType: typeParam }),
        credentials: 'include', // Important for cookies
      });

      if (response.ok) {
        const data = (await response.json()) as SignupResponse;

        // Check if this is development mode with direct authentication
        if (data.redirect) {
          // Development mode: User is already authenticated, but we need to refresh the auth context

          // Wait a bit for the cookie to be properly set
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Refresh the auth context to get the current user
          await refreshUser();

          // Get the redirect path
          const redirectPath = getRedirectPath(data.userType, data.hasEmptyData);

          // Navigate to the appropriate page
          navigate(redirectPath);
          return;
        }

        // Production mode: Show email sent notification
        setPopup("We've sent you a magic link to your email. Please check your inbox.");
      } else {
        const { error } = (await response.json()) as ErrorResponse;
        setPopup(error ?? 'Error sending email.');
      }
    } catch (_err) {
      setPopup('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-4 pt-16">
      <Helmet>
        <title>{typeParam === 'retiree' ? 'Sign Up - Retiree' : 'Sign Up - Startup'}</title>
        <meta
          name="description"
          content="Create your WiseUp account to connect with experienced retirees or innovative startups."
        />
      </Helmet>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Hero Section */}
        <div className="relative hidden lg:block space-y-8 pt-14">
          {/* Back Button */}
          <div className="absolute top-0 left-0">
            <Button
              size="lg"
              variant="secondary"
              className="px-0 py-0 text-primary rounded-full border border-1 transition-shadow transition-colors cursor-pointer font-medium border border-[rgba(255,255,255,0.3)] bg-white/40 bg-clip-padding backdrop-filter backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:text-primary hover:border-primary hover:bg-transparent hover:shadow-lg transform transition-transform duration-200 hover:scale-[1.05] ease-out group"
              onClick={() => {
                void navigate(-1);
              }}
            >
              <ArrowLeft className="ml-2 h-5 w-5" />
              Back
            </Button>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground leading-tight">
              {typeParam === 'retiree' ? 'Ready to make an impact?' : 'Ready to accelerate growth?'}
            </h2>
            <p className="text-l text-muted-foreground leading-relaxed">
              {typeParam === 'retiree'
                ? 'Join our community of experienced retirees and connect with innovative startups that recognize the value of your expertise.'
                : 'Connect with experienced retirees who can help you build, scale and succeed in your business journey.'}
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  typeParam === 'retiree' ? 'bg-white border border-primary' : 'bg-primary'
                }`}
              >
                {typeParam === 'retiree' ? (
                  <Users className="h-6 w-6 text-primary" />
                ) : (
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                )}
              </div>
              <h3 className="font-bold text-foreground text-lg">
                {typeParam === 'retiree' ? 'Retiree Account' : 'Startup Account'}
              </h3>
            </div>
            <div className="space-y-3 text-l">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Secure magic link authentication</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Privacy-focused platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Quick and easy setup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            {/* Back Button for mobile/small screens */}
            <div className="block lg:hidden px-8 pt-6">
              <Button
                size="lg"
                variant="secondary"
                className="px-0 py-0 text-primary rounded-full border border-1 transition-shadow transition-colors cursor-pointer font-medium border border-[rgba(255,255,255,0.3)] bg-white/40 bg-clip-padding backdrop-filter backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:text-primary hover:border-primary hover:bg-transparent hover:shadow-lg transform transition-transform duration-200 hover:scale-[1.05] ease-out group"
                onClick={() => {
                  void navigate(-1);
                }}
              >
                <ArrowLeft className="ml-2 h-5 w-5" />
                Back
              </Button>
            </div>
            <CardHeader className="text-center pb-8 pt-8">
              <div
                className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${typeParam === 'retiree' ? 'bg-white border border-primary' : 'bg-primary'}`}
              >
                {typeParam === 'retiree' ? (
                  <Users className="h-8 w-8 text-primary" />
                ) : (
                  <Building2 className="h-8 w-8 text-primary-foreground" />
                )}
              </div>
              <CardTitle className="text-3xl font-bold text-foreground mb-2">
                Create Your Account
              </CardTitle>
              <p className="text-muted-foreground text-l">
                Join our community and start connecting
              </p>
            </CardHeader>

            <CardContent className="space-y-8 px-8 pb-8">
              {popup && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm">
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-green-800 font-semibold text-lg">Magic Link sent!</h3>
                  </div>
                  <p className="text-green-700 text-base">{popup}</p>
                </div>
              )}
              <form
                onSubmit={(e) => {
                  void handleSignup(e);
                }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full h-12 px-4 text-base border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-200 ${
                      emailError
                        ? 'border-destructive/40 focus:ring-destructive focus:border-destructive'
                        : ''
                    }`}
                  />
                  {emailError && <p className="text-destructive text-sm mt-1">{emailError}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-primary hover:bg-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base cursor-pointer transform transition-transform duration-200 ease-out hover:scale-[1.03] hover:bg-primary group"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Create Account
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center pt-6 border-t border-border">
                <p className="text-muted-foreground text-base">
                  Already have an account?{' '}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      void navigate('/login');
                    }}
                    className="cursor-pointer text-primary hover:text-primary/90 p-0 h-auto font-semibold text-base underline-offset-4"
                  >
                    Login here
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;
