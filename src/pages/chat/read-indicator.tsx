import { CheckCheck } from 'lucide-react';

export default function ReadIndicator({ isRead }: { isRead: boolean }) {
  return (
    <span
      className={`transition-all duration-300 ${isRead ? 'text-primary scale-110' : 'opacity-70'}`}
    >
      <CheckCheck size={16} />
    </span>
  );
}
