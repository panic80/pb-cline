import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import './styles/ChatInput.css';

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  disabled = false,
  placeholder = 'Type a message...',
  maxLength = 1000,
  className = '',
}) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Character count tracking
  const charCount = message.length;
  const isAtMaxLength = charCount >= maxLength;
  const isNearMaxLength = charCount >= maxLength * 0.8;

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [message]);

  // Focus input when component mounts
  useEffect(() => {
    if (!isLoading && !disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading, disabled]);

  const handleSendMessage = () => {
    if (message.trim() && !isLoading && !disabled && !isAtMaxLength) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`chat-input-container ${isFocused ? 'focused' : ''} ${className}`}
    >
      {/* Text input area */}
      <div className="textarea-wrapper">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue.length <= maxLength) {
              setMessage(newValue);
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={isLoading || disabled}
          maxLength={maxLength}
          rows={1}
          className="chat-textarea"
          aria-label="Message input"
        />

        {/* Character counter (shows when getting close to limit) */}
        {isNearMaxLength && (
          <div
            className={`char-counter ${isAtMaxLength ? 'limit-reached' : ''}`}
            aria-live="polite"
          >
            {charCount}/{maxLength}
          </div>
        )}
      </div>

      {/* Send button */}
      <button
        type="button"
        className="chat-send-button"
        onClick={handleSendMessage}
        disabled={!message.trim() || isLoading || disabled || isAtMaxLength}
        aria-label="Send message"
      >
        <div className="send-button-content">
          {isLoading ? (
            <div className="loading-spinner" aria-hidden="true">
              <div className="spinner"></div>
            </div>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </button>
    </div>
  );
};

export default ChatInput;