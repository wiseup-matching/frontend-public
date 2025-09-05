import type { Message } from '@/api/openapi-client';
import ReadIndicator from './read-indicator';

export function ChatMessage(message: Message, userId: string | undefined) {
  const isUserMessage = message.senderId === userId;
  return (
    <div key={message.id} className={`mb-2 ${isUserMessage ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block p-3 rounded-lg ${
          isUserMessage ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
        }`}
      >
        {message.content}
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        <span className="inline-flex items-center gap-1.5 mr-1">
          {isUserMessage && <ReadIndicator isRead={message.read} />}
          {new Date(message.createdAt).toLocaleTimeString(['de-DE'], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
