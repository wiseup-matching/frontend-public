import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuth } from '@/context/AuthContext';
import { defaultApi } from '@/api/defaultapi';
import { toast } from 'sonner';

interface CreateConversationButtonProps {
  startupId: string;
  retireeId: string;
  jobPostingId?: string;
  children?: React.ReactNode;
}

const CreateConversationButton: React.FC<CreateConversationButtonProps> = ({
  startupId,
  retireeId,
  jobPostingId,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    const createConversation = async () => {
      setLoading(true);
      try {
        const participantIds = new Set<string>();
        participantIds.add(startupId);
        participantIds.add(retireeId);

        const conversation = await defaultApi.conversationPost({
          conversationCreate: {
            participantIds,
            jobPostingId,
          },
        });

        // use user type from context (is authorized and logged in)
        if (user?.userType === 'Startup') {
          void navigate(`/startup/conversations/${conversation.id}`);
        } else {
          void navigate(`/retiree/conversations/${conversation.id}`);
        }
      } catch (e) {
        console.error('Error creating conversation:', e);
        toast.error('You have no connections left to start a new conversation.', {
          action: {
            label: 'Upgrade',
            onClick: () => {
              void navigate('/startup/paywall?reason=insufficient_connections');
            },
          },
        });
      } finally {
        setLoading(false);
      }
    };

    void createConversation();
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className="bg-primary text-white hover:bg-[#1e1aa7]"
    >
      {children ?? 'Chat starten'}
    </Button>
  );
};

export default CreateConversationButton;
