import { useCallback, useEffect, useRef, useState } from 'react';
import { defaultApi } from '@/api/defaultapi';
import { type Conversation, type Cooperation, type Message } from '@/api/openapi-client';
import { socket } from '@/socket';
import { toast } from 'sonner';

interface UseConversationSocketProps {
  conversationId?: string;
  userId?: string;
}

interface TypingState {
  typingUsers: Map<string, number>;
  isTyping: boolean;
}

export function useConversationSocket({ conversationId, userId }: UseConversationSocketProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Map<string, number>>(new Map());

  const hasJoinedSocketRoom = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const TYPING_DEBOUNCE_MS = 1000;
  const TYPING_TIMEOUT_MS = 2500;

  const loadConversation = useCallback(async () => {
    if (!conversationId) return;

    try {
      const data = await defaultApi.conversationConversationIdGet({ conversationId });
      await defaultApi.postConversationConversationIdRead({ conversationId });

      setConversation(data);
      setLoading(false);
    } catch {
      toast.error('Conversation could not be loaded. Please try again later.');
      setLoading(false);
    }
  }, [conversationId]);

  const setupSocketListeners = useCallback(() => {
    if (!conversationId || hasJoinedSocketRoom.current) return;

    socket.emit('join-conversation', conversationId);
    hasJoinedSocketRoom.current = true;

    // New message listener
    socket.on('new-message', (message: Message) => {
      setTypingUsers((prev) => {
        const updated = new Map(prev);
        updated.delete(message.senderId);
        return updated;
      });

      setConversation((prev) => {
        if (!prev) return prev;
        return { ...prev, messages: [...prev.messages, message] };
      });

      if (message.senderId !== userId) {
        defaultApi
          .postConversationConversationIdRead({ conversationId })
          .catch((error: unknown) => console.error('Failed to mark message as read:', error));
      }
    });

    // Typing indicator listener
    socket.on(
      'user-typing',
      ({ userId: typingUserId, timestamp }: { userId: string; timestamp: number }) => {
        setTypingUsers((prev) => {
          const updated = new Map(prev);
          updated.set(typingUserId, timestamp);
          return updated;
        });
      },
    );

    // Message updates listener
    socket.on('update-messages', ({ messages }: { messages: Message[] }) => {
      if (messages.length === 0) return;

      setConversation((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.map((msg) => {
            const updatedMessage = messages.find((m) => m.id === msg.id);
            return updatedMessage ?? msg;
          }),
        };
      });
    });

    // Cooperation update listener
    socket.on('conversation-cooperation-update', (cooperation: Cooperation) => {
      setConversation((prev) => {
        if (!prev) return prev;
        return { ...prev, cooperation };
      });
    });
  }, [conversationId, userId]);

  const cleanupSocketListeners = useCallback(() => {
    if (!conversationId) return;

    socket.emit('leave-conversation', conversationId);
    socket.off('new-message');
    socket.off('user-typing');
    socket.off('update-messages');
    socket.off('conversation-cooperation-update');
    hasJoinedSocketRoom.current = false;
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !conversation?.id) return false;

      try {
        const createdMessage = await defaultApi.conversationConversationIdMessagePost({
          conversationId: conversation.id,
          messageCreate: { content: content.trim() },
        });

        if (!socket.active) {
          setConversation((prev) => {
            if (!prev) return prev;
            return { ...prev, messages: [...prev.messages, createdMessage] };
          });
        }

        return true;
      } catch {
        toast.error('Message could not be sent. Please try again later.');
        return false;
      }
    },
    [conversation?.id],
  );

  const emitTyping = useCallback(() => {
    if (!conversationId || typingTimeoutRef.current) return;

    socket.emit('typing-start', conversationId);
    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
    }, TYPING_DEBOUNCE_MS);
  }, [conversationId, TYPING_DEBOUNCE_MS]);

  // Load conversation on mount
  useEffect(() => {
    loadConversation().catch(() => {
      toast.error('Conversation could not be loaded. Please try again later.');
      setLoading(false);
    });
  }, [loadConversation]);

  // Setup socket listeners
  useEffect(() => {
    setupSocketListeners();
    return cleanupSocketListeners;
  }, [setupSocketListeners, cleanupSocketListeners]);

  // Cleanup typing users
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers((prev) => {
        const updated = new Map(prev);
        const now = Date.now();

        updated.forEach((timestamp, userId) => {
          if (now - timestamp > TYPING_TIMEOUT_MS) {
            updated.delete(userId);
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [TYPING_TIMEOUT_MS]);

  const typingState: TypingState = {
    typingUsers,
    isTyping: typingUsers.size > 0,
  };

  return {
    conversation,
    loading,
    typingState,
    sendMessage,
    emitTyping,
    setConversation,
  };
}
