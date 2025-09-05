import type { Conversation, Cooperation, UserPublicSummary } from '@/api/openapi-client';
import { BriefcaseBusiness, ChevronLeft } from 'lucide-react';
import { AppBarButton, ConversationCooperationButton } from './buttons';
import type { User } from '@/context/AuthContext';
import { useNavigate } from 'react-router';

export default function ChatAppBar({
  conversation,
  conversationPartner,
  conversationTitle,
  user,
  setConversation,
}: {
  conversation: Conversation;
  conversationPartner: UserPublicSummary | undefined;
  conversationTitle: string;
  user: User | null;
  setConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
}) {
  const navigate = useNavigate();
  return (
    <div className="w-full flex items-center justify-between gap-x-4 bg-primary text-primary-foreground p-4">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="cursor-pointer block sm:hidden"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ChevronLeft className="h-6 w-6 flex-shrink-0" />
        </button>

        <a
          href={
            (conversationPartner?.userType === 'Retiree' ? '/retiree' : '/startup') +
            '/public/' +
            (conversationPartner?.id.toString() ?? '')
          }
          className="flex items-center space-x-4"
        >
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold border-gray-300 border-2">
            {conversationPartner?.profilePicture ? (
              <img
                src={conversationPartner.profilePicture}
                alt={conversationPartner.nameLast}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              conversationPartner?.nameLast.charAt(0).toUpperCase()
            )}
          </div>
          {/* conversation partner name */}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">{conversationTitle} </h1>
            <span className="text-muted text-xs">{conversationPartner?.shortDescription}</span>
          </div>
        </a>
      </div>

      <div className="flex items-center gap-2 min-w-0 flex-nowrap">
        <ConversationCooperationButton
          conversation={conversation}
          user={user}
          setCooperation={(cooperation: Cooperation) => {
            setConversation((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                cooperation,
              };
            });
          }}
        />
        {conversation.jobPosting && (
          <a href={`/job/${conversation.jobPosting.id}`} className="no-underline min-w-0">
            <AppBarButton
              icon={<BriefcaseBusiness className="h-4 w-4 flex-shrink-0" />}
              label={conversation.jobPosting.title}
            />
          </a>
        )}
      </div>
    </div>
  );
}
