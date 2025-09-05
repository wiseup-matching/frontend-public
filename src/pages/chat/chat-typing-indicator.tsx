export function TypingIndicator({ isTyping }: { isTyping: boolean }) {
  // diplayed as typing indicator, animated dots
  return (
    <div
      className={`w-min flex items-center space-x-1 mb-4 p-3 rounded-lg bg-secondary text-foreground transition-discrete transition-all duration-300 ease-in-out origin-bottom-left ${
        isTyping
          ? 'opacity-100 scale-100 max-h-20'
          : 'hidden opacity-0 scale-95 max-h-0 overflow-hidden'
      }`}
    >
      <span className="animate-bounce delay-0 bg-black rounded-full w-2 h-2"></span>
      <span className="animate-bounce delay-100 bg-black rounded-full w-2 h-2"></span>
      <span className="animate-bounce delay-200 bg-black rounded-full w-2 h-2"></span>
    </div>
  );
}
