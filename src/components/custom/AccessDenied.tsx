import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AccessDeniedProps {
  requiredUserType?: 'Retiree' | 'Startup';
  currentUserType?: 'Retiree' | 'Startup';
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredUserType, currentUserType }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getMessage = () => {
    if (requiredUserType && currentUserType) {
      return `This page is only accessible to ${requiredUserType}s. You are currently logged in as a ${currentUserType}.`;
    }
    if (requiredUserType) {
      return `This page is only accessible to ${requiredUserType}s.`;
    }
    return 'You do not have permission to access this page.';
  };

  const getTitle = () => {
    if (requiredUserType && currentUserType) {
      return `Access Restricted - ${requiredUserType} Only`;
    }
    return 'Access Denied';
  };

  const handleGoHome = () => {
    if (user) {
      // If user is logged in, redirect to their browse page
      if (user.userType === 'Retiree') {
        navigate('/retiree/browse-jobs');
      } else {
        navigate('/startup/browse-retirees');
      }
    } else {
      // If not logged in, go to signup page
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ShieldX className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600 leading-relaxed">{getMessage()}</p>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={handleGoHome}
              className="cursor-pointer w-full bg-primary cursor-pointer text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>

            <Button
              onClick={() => {
                navigate(-1);
              }}
              variant="outline"
              className="w-full cursor-pointer border-gray-300 text-black hover:text-black hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDenied;
