import { useAuth } from '@/context/AuthContext';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ChatRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { id: conversationId } = useParams();

  useEffect(() => {
    // Redirect based on user type
    if (user) {
      if (user.userType === 'Retiree') {
        navigate('/retiree/conversations/' + (conversationId ?? ''));
      } else {
        navigate('/startup/conversations/' + (conversationId ?? ''));
      }
    } else if (!loading) {
      // If not authenticated, redirect to login
      navigate('/login');
    }
  }, [user, navigate, loading, conversationId]);

  // Return loading state while redirecting
  return (
    <div className="flex justify-center items-center h-screen">
      <Helmet>
        <title>Redirecting to Chat</title>
      </Helmet>
      <p>Redirecting to chat...</p>
    </div>
  );
};

export default ChatRedirect;
