import React, { useEffect, useRef, useState } from 'react';

interface ModernChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  onTyping: (value: string) => void;
  isLoading: boolean;
  maxLength: number;
}

// Icon for the send button
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Loading spinner icon
const LoadingIcon = () => (
  <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
  </svg>
);

const ModernChatInput: React.FC<ModernChatInputProps> = ({
  input,
  setInput,
  handleSend,
  onTyping,
  isLoading,
  maxLength,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  
  // Character counter states
  const charCount = input.length;
  const percentage = Math.min((charCount / maxLength) * 100, 100);
  const isNearLimit = charCount > maxLength * 0.8;
  const isAtLimit = charCount >= maxLength;
  
  // Determine counter status
  const getCounterStatus = () => {
    if (isAtLimit) return 'error';
    if (isNearLimit) return 'warning';
    return 'normal';
  };
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);
  
  // Focus textarea on component mount and after loading
  useEffect(() => {
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus();
    }
  }, [isLoading]);
  
  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send the message on Enter (unless Shift is pressed for a new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading && !isAtLimit) {
        handleSend();
      }
    }
  };
  
  return (
    <>
      <div className={`compose-box ${isFocused ? 'focused' : ''}`}>
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
          className="message-input"
          maxLength={maxLength}
          aria-label="Message input"
          aria-describedby="char-counter"
          disabled={isLoading}
        />
        
        <button
          onClick={handleSend}
          disabled={isLoading || input.trim() === "" || isAtLimit}
          className="send-button"
          aria-label="Send message"
          title={isLoading ? "Sending..." : "Send message"}
        >
          {isLoading ? <LoadingIcon /> : <SendIcon />}
        </button>
      </div>
      
      <div className="input-controls">
        {/* Character counter */}
        <div className="char-counter" aria-live="polite">
          {isNearLimit && (
            <div className="counter-bar">
              <div 
                className={`counter-progress ${getCounterStatus()}`} 
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
          <span>{charCount}/{maxLength}</span>
        </div>
        
        {/* Keyboard shortcut hint */}
        <div className="keyboard-hint">
          Press <kbd>Enter</kbd> to send, <kbd>Shift</kbd>+<kbd>Enter</kbd> for new line
        </div>
      </div>
    </>
  );
};

export default ModernChatInput;