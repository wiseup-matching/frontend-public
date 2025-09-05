import { defaultApi } from '@/api/defaultapi';
import type { Conversation, Cooperation, UserPublicSummary } from '@/api/openapi-client';
import { Button } from '@/components/ui/button';
import type { User } from '@/context/AuthContext';
import { socket } from '@/socket';
import { Handshake } from 'lucide-react';
import { toast } from 'sonner';

export function ConversationCooperationButton({
  conversation,
  user,
  setCooperation,
}: {
  conversation: Conversation;
  user: User | null;
  setCooperation: (cooperation: Cooperation) => void;
}) {
  const userIsRetiree = user?.userType === 'Retiree';
  const userIsStartup = user?.userType === 'Startup';
  const conversationPartner = conversation.participants.find((p) => p.id !== user?.id);

  return (
    <>
      {userIsRetiree && (
        <ConversationCooperationRetireeButton
          conversation={conversation}
          setCooperation={setCooperation}
        />
      )}
      {userIsStartup && conversationPartner && (
        <ConversationCooperationStartupButton
          conversation={conversation}
          conversationPartner={conversationPartner}
          setCooperation={setCooperation}
        />
      )}
    </>
  );
}

export function ConversationCooperationStartupButton({
  conversation,
  conversationPartner,
  setCooperation,
}: {
  conversation: Conversation;
  conversationPartner: UserPublicSummary;
  setCooperation: (cooperation: Cooperation) => void;
}) {
  if (!conversation.jobPosting) {
    return null;
  }

  const isDisabled = conversation.cooperation !== undefined;

  const handleRequestCooperation = async () => {
    if (!conversation.jobPosting || isDisabled) {
      return;
    }
    try {
      const cooperation = await defaultApi.cooperationPost({
        cooperationCreate: {
          jobPostingId: conversation.jobPosting.id,
          retireeId: conversationPartner.id,
        },
      });
      setCooperation(cooperation);
      socket.emit('conversation-cooperation-update', {
        cooperation,
        conversationId: conversation.id,
      });
      toast.success('Cooperation invite sent successfully!');
    } catch {
      toast.error('Failed to send cooperation invite. Please try again later.');
    }
  };

  return (
    <AppBarButton
      icon={<Handshake className="h-4 w-4 flex-shrink-0" />}
      label={
        conversation.cooperation
          ? conversation.cooperation.status === 'pending'
            ? 'Cooperation Requested'
            : 'Cooperation Established'
          : 'Request Cooperation'
      }
      onClick={() => {
        handleRequestCooperation().catch((error: unknown) => {
          console.error('Failed to request cooperation:', error);
          toast.error('Failed to send cooperation invite. Please try again later.');
        });
      }}
      isDisabled={isDisabled}
    />
  );
}

export function ConversationCooperationRetireeButton({
  conversation,
  setCooperation,
}: {
  conversation: Conversation;
  setCooperation: (cooperation: Cooperation) => void;
}) {
  if (!conversation.jobPosting || !conversation.cooperation) {
    return null;
  }

  const isDisabled = conversation.cooperation.status !== 'pending';

  const handleAcceptCooperation = async () => {
    try {
      if (!conversation.cooperation || isDisabled) {
        return;
      }
      const cooperation = await defaultApi.cooperationCooperationIdPut({
        cooperationId: conversation.cooperation.id,
        cooperationUpdate: { status: 'accepted' },
      });
      setCooperation(cooperation);
      socket.emit('conversation-cooperation-update', {
        cooperation,
        conversationId: conversation.id,
      });
      toast.success('Cooperation accepted successfully!');
    } catch {
      toast.error('Failed to accept cooperation. Please try again later.');
    }
  };

  return (
    <AppBarButton
      icon={<Handshake className="h-4 w-4 mr-1 flex-shrink-0" />}
      label={
        conversation.cooperation.status === 'pending'
          ? 'Accept Cooperation'
          : 'Cooperation Established'
      }
      onClick={() => {
        handleAcceptCooperation().catch((error: unknown) => {
          console.error('Failed to accept cooperation:', error);
          toast.error('Failed to accept cooperation. Please try again later.');
        });
      }}
      isDisabled={isDisabled}
    />
  );
}

export function AppBarButton({
  icon,
  label,
  onClick,
  isDisabled = false,
  className = '',
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isDisabled?: boolean;
  className?: string;
}) {
  return (
    <Button
      variant="outline"
      className={`
        cursor-pointer rounded-full bg-white border border-white shadow text-primary font-semibold hover:bg-white hover:border-primary hover:text-primary ml-auto
        flex items-center justify-center
        w-10 h-10 p-0
        lg:w-auto lg:h-auto lg:px-6 lg:py-2
        lg:px-4
        ${className}
      `}
      onClick={onClick}
      type="button"
      disabled={isDisabled}
    >
      <div className="flex items-center justify-center w-full h-full min-w-0">
        {icon}
        <span className="hidden lg:inline ml-2 truncate">{label}</span>
      </div>
    </Button>
  );
}
