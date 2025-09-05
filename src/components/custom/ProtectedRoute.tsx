import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useRetiree } from '@/hooks/useRetiree';
import { useStartup } from '@/hooks/useStartup';
import { isRetireeProfileComplete, isStartupProfileComplete } from '@/lib/utils';
import { AlertCircle, LoaderCircleIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccessDenied from './AccessDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'Retiree' | 'Startup';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredUserType }) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Only call the appropriate hook based on user type
  const { retiree, loading: retireeLoading } = useRetiree(
    user?.userType === 'Retiree' ? user.id : undefined,
  );
  const { startup, loading: startupLoading } = useStartup(
    user?.userType === 'Startup' ? user.id : undefined,
  );

  // Only show loading if auth is loading or if we're waiting for user data
  const loading =
    authLoading ||
    (user &&
      ((user.userType === 'Retiree' && retireeLoading) ||
        (user.userType === 'Startup' && startupLoading)));

  useEffect(() => {
    // Reset states when user changes to prevent showing notification for previous user's data
    if (user) {
      setShowNotification(false);
      setRedirecting(false);
      setProgress(0);
    }
  }, [user?.id]); // Only reset when user ID changes

  useEffect(() => {
    if (!loading && user) {
      // Determine the correct redirect path based on user type and profile completion
      let redirectPath = '';
      let shouldShowNotification = false;

      if (user.userType === 'Retiree') {
        if (retireeLoading) return;

        if (!retiree || !isRetireeProfileComplete(retiree)) {
          redirectPath = '/retiree/profile/edit';
          shouldShowNotification = true;
        }
      } else {
        if (startupLoading) return;

        if (!startup || !isStartupProfileComplete(startup)) {
          redirectPath = '/startup/profile/edit';
          shouldShowNotification = true;
        }
      }

      // Handle redirects - but only if we're not already on the correct page
      if (redirectPath && shouldShowNotification && !showNotification) {
        // Check if we're already on the profile edit page - if so, don't show notification
        const currentPath = window.location.pathname;
        if (currentPath === redirectPath) {
          return; // Already on the correct page, don't show notification
        }

        // Start notification and animation
        setShowNotification(true);
        setRedirecting(true);
        setProgress(0);

        const startTime = Date.now();
        const duration = 3000; // 3 seconds

        // Progress animation - update every 16ms (60fps) for smooth animation
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const newProgress = Math.min((elapsed / duration) * 100, 100);

          setProgress(newProgress);

          if (newProgress >= 100) {
            clearInterval(progressInterval);
          }
        }, 16); // 60fps

        // Navigate after exactly 3 seconds
        setTimeout(() => {
          navigate(redirectPath);
        }, 3000);
      } else if (redirectPath && !shouldShowNotification) {
        // Direct redirect without notification
        navigate(redirectPath);
      }
    }
  }, [
    user,
    retiree,
    startup,
    loading,
    retireeLoading,
    startupLoading,
    navigate,
    requiredUserType,
    showNotification,
  ]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex items-center gap-4">
            <LoaderCircleIcon className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  // Check if user has the required user type
  if (requiredUserType && user.userType !== requiredUserType) {
    return <AccessDenied requiredUserType={requiredUserType} currentUserType={user.userType} />;
  }

  return (
    <>
      {/* Profile completion notification */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="bg-blue-50 border-blue-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-primary font-medium">Complete Your Profile</p>
                  <p className="text-primary text-sm">
                    Please fill out your profile before continuing.
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-100 ease-linear"
                  style={{
                    width: `${Math.min(progress, 100).toString()}%`,
                  }}
                />
              </div>

              {/* Redirecting message */}
              <p className="text-primary text-xs mt-2 text-center">
                Redirecting to complete your profile...
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Show children only if not redirecting */}
      {!redirecting && children}
    </>
  );
};

export default ProtectedRoute;
