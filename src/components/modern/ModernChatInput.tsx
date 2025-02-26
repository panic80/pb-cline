import React, { useEffect, useRef, useState } from 'react';
import { FaFont } from 'react-icons/fa';

interface ModernChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  onTyping: (value: string) => void;
  isLoading: boolean;
  maxLength: number;
  fontSize?: number;
  onFontSizeChange?: (size: number) => void;
  networkError?: boolean;
  onRetry?: () => void;
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

// New retry icon
const RetryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ModernChatInput: React.FC<ModernChatInputProps> = ({
  input,
  setInput,
  handleSend,
  onTyping,
  isLoading,
  maxLength,
  fontSize = 16,
  onFontSizeChange,
  networkError = false,
  onRetry
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isTypingActive, setIsTypingActive] = useState<boolean>(false);
  
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
  
  // Enhanced auto-resize textarea with maximum height
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to correctly calculate the new height
      textareaRef.current.style.height = 'auto';
      // Set new height, but cap it at 120px
      const maxHeight = 120;
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      
      // Add scrolling if content exceeds max height
      textareaRef.current.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [input]);
  
  // Visual indication of typing activity
  useEffect(() => {
    if (input && !isTypingActive) {
      setIsTypingActive(true);
    } 
    else if (input === '' && isTypingActive) {
      setIsTypingActive(false);
    }
    
    // Notify parent component about typing activity
    onTyping(input);
  }, [input, isTypingActive, onTyping]);
  
  // Focus textarea on component mount and after loading
  useEffect(() => {
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus();
    }
  }, [isLoading]);
  
  // Handle key events with enhanced enter key behavior
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send the message on Enter (unless Shift is pressed for a new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading && !isAtLimit) {
        handleSend();
      }
      // If there's a network error and retry function, use it
      else if (networkError && onRetry && input.trim()) {
        onRetry();
      }
    }
  };
  
  // Font size control functions
  const increaseFontSize = () => {
    if (fontSize < 24) { // Max font size
      const newSize = fontSize + 2;
      if (onFontSizeChange) {
        onFontSizeChange(newSize);
      }
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) { // Min font size
      const newSize = fontSize - 2;
      if (onFontSizeChange) {
        onFontSizeChange(newSize);
      }
    }
  };
  
  return (
    <>
      <div className={`compose-box ${isFocused ? 'focused' : ''} ${isTypingActive ? 'typing' : ''} ${networkError ? 'error' : ''}`}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            // Limit input to maxLength characters
            if (e.target.value.length <= maxLength) {
              setInput(e.target.value);
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
          style={{ fontSize: `${fontSize}px` }}
        />
        
        <div className="font-size-controls">
          <button
            type="button"
            className="icon-button font-size-button"
            onClick={decreaseFontSize}
            aria-label="Decrease font size"
            disabled={fontSize <= 12}
          >
            <FaFont size={12} />
          </button>
          <button
            type="button"
            className="icon-button font-size-button"
            onClick={increaseFontSize}
            aria-label="Increase font size"
            disabled={fontSize >= 24}
          >
            <FaFont size={18} />
          </button>
        </div>
        
        <button
          onClick={networkError && onRetry ? onRetry : handleSend}
          disabled={isLoading || input.trim() === "" || isAtLimit}
          className={`send-button ${networkError ? 'retry' : ''}`}
          aria-label={networkError ? "Retry" : "Send message"}
          title={networkError ? "Retry sending message" : isLoading ? "Sending..." : "Send message"}
        >
          {isLoading ? <LoadingIcon /> : networkError ? <RetryIcon /> : <SendIcon />}
        </button>
      </div>
      
      <div className="input-controls">
        {/* Character counter with enhanced visibility when approaching limit */}
        <div className={`char-counter ${isNearLimit ? 'visible' : ''}`} aria-live="polite">
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