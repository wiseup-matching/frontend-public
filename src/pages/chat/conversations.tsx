import { defaultApi } from '@/api/defaultapi';
import type { ConversationSummary, UserPublicSummary } from '@/api/openapi-client';
import { ConversationSummaryFromJSON } from '@/api/openapi-client';
import ProtectedRoute from '@/components/custom/ProtectedRoute';
import { useAuth, type User } from '@/context/AuthContext';
import { socket } from '@/socket';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Chat from './chat';
import ReadIndicator from './read-indicator';
import { MessageCircleMore, SearchIcon, SearchX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function ConversationsPage({ isRetiree }: { isRetiree: boolean }) {
  const { id } = useParams<{ id: string }>();
  const { user, loading: userLoading } = useAuth();
  const initialSearch = new URLSearchParams(window.location.search).get('search') ?? '';
  const [search, setSearch] = useState<string>(initialSearch);

  // Sample data for chat list
  const [chats, setChats] = useState<ConversationSummary[]>([]);

  useEffect(() => {
    defaultApi
      .conversationGet()
      .then((data) => {
        setChats(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    function handleConversationSummaryUpdate(
      conversationSummaryJson: unknown,
      callback?: (msg: string) => unknown,
    ) {
      const summary = ConversationSummaryFromJSON(conversationSummaryJson);
      if (id === summary.id) {
        summary.unreadMessageCount = 0; // Mark as read if we are in the conversation
      }
      setChats((prev) => {
        const existingIndex = prev.findIndex((c) => c.id === summary.id);
        if (existingIndex !== -1) {
          // Update existing conversation
          const updatedChats = [...prev];
          updatedChats[existingIndex] = summary;
          return updatedChats;
        } else {
          // Add new conversation
          return [...prev, summary];
        }
      });
      if (callback) {
        // needed so that backend does not need to send an email notification
        callback('online');
      }
    }
    if (!socket.listeners('conversation-summary-update').length) {
      socket.on('conversation-summary-update', handleConversationSummaryUpdate);
    }

    return () => {
      socket.off('conversation-summary-update', handleConversationSummaryUpdate);
    };
  }, [id]);

  function setSearchAndUpdateUrl(newSearch: string) {
    setSearch(newSearch);
    const url = new URL(window.location.href);
    if (newSearch === '') {
      url.searchParams.delete('search');
    } else {
      url.searchParams.set('search', newSearch);
    }
    window.history.replaceState({}, '', url.toString());
  }

  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      const searchString = search.toLowerCase();
      const partner = chat.participants.find((p) => p.id !== user?.id);
      const fullName = partner ? `${partner.nameFirst} ${partner.nameLast}`.toLowerCase() : '';
      if (partner && fullName.includes(searchString)) return true;
      const jobPostingTitle = chat.jobPosting?.title.toLowerCase() ?? '';
      return jobPostingTitle.includes(searchString);
    });
  }, [chats, search, user?.id]);

  const sortedConversations = useMemo(() => {
    return [...filteredChats].sort((a, b) => {
      // Sort by last message date, then by creation date
      const aDate = new Date(a.lastMessage?.createdAt ?? a.createdAt);
      const bDate = new Date(b.lastMessage?.createdAt ?? b.createdAt);
      return bDate.getTime() - aDate.getTime();
    });
  }, [filteredChats]);

  const conversationsByJobPostings = useMemo(() => {
    const map = new Map<string | undefined, ConversationSummary[]>();
    sortedConversations.forEach((conversation) => {
      const jobPostingId = conversation.jobPosting?.id;
      if (!map.has(jobPostingId)) {
        map.set(jobPostingId, []);
      }
      map.get(jobPostingId)?.push(conversation);
    });
    return map;
  }, [sortedConversations]);

  if (!user && !userLoading) return <div>Please log in to view your chats.</div>;

  return (
    <ProtectedRoute requiredUserType={isRetiree ? 'Retiree' : 'Startup'}>
      <Helmet>
        <title>Chat</title>
      </Helmet>
      <main className="flex h-[calc(100vh-64px-2px)] bg-gray-50 w-full max-w-5xl mx-auto shadow-lg rounded-lg overflow-hidden">
        {/* Chat list sidebar, hide on mobile if chat is selected */}
        <aside
          className={
            'w-full sm:w-1/4 bg-gray-50 border-r border-gray-200 overflow-y-auto' +
            (id ? ' hidden sm:block' : '')
          }
        >
          <header className="p-4 flex justify-between items-center min-h-[80px]">
            <h3 className="w-full">
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon className="h-5 w-5" />
                </span>
                <Input
                  placeholder="Search"
                  className="pl-10 bg-secondary/50 rounded-xl border-none shadow-none focus:ring-0"
                  value={search}
                  onChange={(e) => setSearchAndUpdateUrl(e.target.value)}
                />
              </div>
            </h3>
          </header>
          <nav className="overflow-y-auto overflow-x-hidden border-t border-gray-200">
            {sortedConversations.length === 0 && (
              <div className="p-4 text-gray-500 text-center">
                <div className="my-6">
                  <MessageCircleMore className="w-12 h-12 mx-auto text-gray-400" />
                </div>
                <p className="font-medium">No conversations {chats.length > 0 ? 'found' : 'yet'}</p>
                <p className="text-sm mt-1">
                  {chats.length === 0
                    ? 'Start a new conversation to connect!'
                    : "We couldn't find anything matching your search."}
                </p>
                {chats.length > 0 && (
                  <Button
                    variant="outline"
                    className="mt-4 cursor-pointer text-xs px-2 py-1 h-min"
                    onClick={() => setSearchAndUpdateUrl('')}
                  >
                    <SearchX className="h-4 w-4 mr" />
                    Clear Search
                  </Button>
                )}
              </div>
            )}
            {user &&
              Array.from(conversationsByJobPostings.entries()).map(
                ([jobPostingId, conversations]) => (
                  <div key={jobPostingId} className="px-1 flex flex-col space-y-0.5">
                    {conversations[0].jobPosting && (
                      <h4 className="text-sm text-center font-semibold text-gray-600 mt-4 mb-1">
                        {conversations[0].jobPosting.title}
                      </h4>
                    )}
                    {conversations.map((conversation) => {
                      const conversationPartner = conversation.participants.find(
                        (p) => p.id !== user.id,
                      );
                      if (!conversationPartner) return null; // Skip if no partner found
                      return (
                        <ConversationListItem
                          key={conversation.id}
                          conversation={conversation}
                          isRetiree={isRetiree}
                          conversationPartner={conversationPartner}
                          user={user}
                          selectedConversationId={id}
                        />
                      );
                    })}
                  </div>
                ),
              )}
          </nav>
        </aside>

        {/* Chat window, hide on mobile if no chat is selected */}
        <section className={'w-full flex-1 flex flex-col' + (id ? '' : ' hidden sm:flex')}>
          <Chat conversationId={id} />
        </section>
      </main>
    </ProtectedRoute>
  );
}

// Helper function to format message time label
// Returns "HH:mm" for today, "Yesterday" for yesterday, or "DD.MM.YYYY" for older dates
function getMessageTimeLabel(timestamp: Date): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (timestamp.toDateString() === today.toDateString()) {
    return timestamp.toLocaleTimeString(['de-DE'], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (timestamp.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return timestamp.toLocaleDateString(['de-DE'], {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    });
  }
}

function ConversationListItem({
  conversation,
  isRetiree,
  conversationPartner,
  user,
  selectedConversationId,
}: {
  conversation: ConversationSummary;
  isRetiree: boolean;
  conversationPartner: UserPublicSummary;
  user: User;
  selectedConversationId: string | undefined;
}) {
  const messageTimeLabel = getMessageTimeLabel(
    new Date(conversation.lastMessage?.createdAt ?? conversation.createdAt),
  );

  return (
    <a
      key={conversation.id}
      className={`w-full flex px-4 py-2 rounded-sm hover:bg-gray-200 cursor-pointer ${selectedConversationId === conversation.id ? 'bg-secondary' : ''}`}
      href={
        isRetiree
          ? `/retiree/conversations/${conversation.id}`
          : `/startup/conversations/${conversation.id}`
      }
    >
      <div className="relative w-12 h-12 aspect-square rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold mr-3">
        {/* Unread message count */}
        {conversation.unreadMessageCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {conversation.unreadMessageCount}
          </div>
        )}
        {/* Avatar or initials */}
        {conversationPartner.profilePicture ? (
          <img
            src={conversationPartner.profilePicture}
            alt={conversationPartner.nameLast}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          conversationPartner.nameLast.charAt(0).toUpperCase() || ''
        )}
      </div>
      <div className="flex flex-col w-full overflow-hidden">
        {/* Name and time */}
        <div className="flex justify-between items-start w-full font-medium line-clamp-2 overflow-ellipsis">
          <span>{conversationPartner.nameFirst + ' ' + conversationPartner.nameLast}</span>
          <span className="text-xs text-gray-500 ml-2 mt-1">{messageTimeLabel}</span>
        </div>
        {/* Short description */}
        <span className="text-gray-500 text-xs">{conversationPartner.shortDescription}</span>
        {/* Last message preview */}
        {conversation.lastMessage && (
          <div className="w-full mt-1 flex items-center text-xs text-gray-500">
            {conversation.lastMessage.senderId === user.id ? (
              <span className="mr-1">
                <ReadIndicator isRead={conversation.lastMessage.read} />
              </span>
            ) : (
              <span className="mr-1 font-semibold">{conversationPartner.nameLast}:</span>
            )}
            <span className="truncate">{conversation.lastMessage.content}</span>
          </div>
        )}
      </div>
    </a>
  );
}

export default ConversationsPage;
