// components/Chat.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { socket } from '@/socket';
import { toast } from 'sonner';
import { type Message } from '@/api/openapi-client';
import ChatAppBar from './chat-app-bar';
import { ChatMessage } from './chat-message';
import { TypingIndicator } from './chat-typing-indicator';
import { useConversationSocket } from '../../hooks/useConversationSocket';
import LoadingPage from '../loading-page';

function Chat({ conversationId }: { conversationId?: string }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const { conversation, loading, typingState, sendMessage, emitTyping, setConversation } =
    useConversationSocket({
      conversationId,
      userId: user?.id,
    });

  const trimmedMessage = newMessage.trim();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [conversation?.messages]);

  // Auto-scroll when typing indicator changes
  useEffect(() => {
    const messageRefAlreadyInView =
      (messagesEndRef.current?.getBoundingClientRect().bottom ?? 0) <= window.innerHeight;

    if (messageRefAlreadyInView) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [typingState.isTyping]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();

    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewMessage(e.target.value);
    emitTyping();
  }

  // Early returns for different states
  if (!conversationId) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        No conversation selected yet.
      </div>
    );
  }

  if (loading) return <LoadingPage />;

  if (!conversation) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Conversation not found
      </div>
    );
  }

  // Group messages by date
  const messagesByDates = conversation.messages.reduce(
    (acc: Record<string, Message[]>, message) => {
      const date = new Date(message.createdAt).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    },
    {},
  );

  const sortedDates = Object.keys(messagesByDates).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  const conversationPartner = conversation.participants.find((p) => p.id !== user?.id);
  const conversationTitle = !conversationPartner?.nameFirst
    ? '-'
    : `${conversationPartner.nameFirst} ${conversationPartner.nameLast}`;

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-64px)] w-full mx-auto">
      <Helmet>
        <title>{conversationTitle} - Chat</title>
      </Helmet>

      <ChatAppBar
        conversation={conversation}
        conversationPartner={conversationPartner}
        conversationTitle={conversationTitle}
        user={user}
        setConversation={setConversation}
      />

      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-end">
        {!socket.connected && (
          <div className="sticky top-0 bg-primary text-white p-2 text-sm text-center rounded-lg mb-2">
            You're currently offline. Please check your internet connection or try again later.
          </div>
        )}

        {sortedDates.map((date) => (
          <div key={date}>
            <div className="text-center my-4">
              <span className="bg-muted text-muted-foreground px-4 py-1 rounded-full text-sm">
                {date}
              </span>
            </div>
            {messagesByDates[date].map((message: Message) => ChatMessage(message, user?.id))}
          </div>
        ))}

        <TypingIndicator isTyping={typingState.isTyping} />
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          handleSendMessage(e).catch((error: unknown) => {
            console.error('Failed to send message:', error);
            toast.error('Message could not be sent. Please try again later.');
          });
        }}
        className="bg-gray-50 border-t p-4 flex"
      >
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Message"
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          type="submit"
          disabled={!trimmedMessage}
          className="rounded-l-none h-full bg-primary text-white disabled:bg-gray-600 disabled:opacity-100"
        >
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}

export default Chat;
