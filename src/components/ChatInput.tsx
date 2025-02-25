import React, { useEffect, useRef, useState } from 'react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  onTyping: (value: string) => void;
  isLoading: boolean;
  isSimplified?: boolean;
  setIsSimplified?: (value: boolean) => void;
  theme?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSend,
  onTyping,
  isLoading,
  isSimplified,
  setIsSimplified,
  theme,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  // Focus textarea on component mount
  useEffect(() => {
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send the message on Enter (unless Shift is pressed for a new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading && !isAtLimit) {
        handleSend();
      }
    }
  };

  // Character counter
  const maxLength = 500;
  const charCount = input.length;
  const isNearLimit = charCount > maxLength * 0.8;
  const isAtLimit = charCount >= maxLength;
  
  // Calculate percentage for character counter visual indicator
  const percentage = Math.min((charCount / maxLength) * 100, 100);
  const counterColor = isAtLimit 
    ? 'var(--error-text)' 
    : isNearLimit 
      ? 'var(--accent-secondary)' 
      : 'var(--text-secondary)';

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className={`input-container ${isFocused ? 'focused' : ''}`}
      >
        {/* Input area */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              // Limit input to maxLength characters
              if (e.target.value.length <= maxLength) {
                setInput(e.target.value);
                onTyping(e.target.value);
              }
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask about Canadian Forces travel instructions..."
            className="message-input w-full resize-none"
            rows={1}
            maxLength={maxLength}
            aria-label="Message input"
            aria-describedby="char-counter"
            disabled={isLoading}
          />
          
          {/* Character counter with visual indicator */}
          <div 
            id="char-counter"
            className="absolute -bottom-6 right-1 text-xs flex items-center gap-1"
            style={{ color: counterColor }}
            aria-live="polite"
            aria-atomic="true"
          >
            {isNearLimit && (
              <div className="h-1.5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-1">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: counterColor 
                  }}
                />
              </div>
            )}
            <span>{charCount}/{maxLength}</span>
          </div>
        </div>
        
        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={isLoading || input.trim() === "" || isAtLimit}
          className="send-button"
          aria-label="Send message"
          title={isLoading ? "Sending..." : "Send message"}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13"></path>
              <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
            </svg>
          )}
        </button>
      </div>
      
      {/* Keyboard shortcuts hint */}
      <div className="mt-2 text-xs text-center text-gray-400 dark:text-gray-500">
        Press <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line
      </div>
    </div>
  );
};

export default ChatInput;