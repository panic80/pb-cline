import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import './styles/ChatInput.css';

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  attachmentTypes?: string[];
  onAttachmentUpload?: (files: File[]) => void;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  disabled = false,
  placeholder = 'Type a message...',
  maxLength = 1000,
  attachmentTypes = ['image/*', 'application/pdf'],
  onAttachmentUpload,
  className = '',
}) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onAttachmentUpload) {
      onAttachmentUpload(Array.from(e.target.files));
      e.target.value = ''; // Reset input for future uploads
    }
  };

  return (
    <div 
      className={`chat-input-container ${isFocused ? 'focused' : ''} ${className}`}
    >
      {/* Attachment button (if upload handler exists) */}
      {onAttachmentUpload && (
        <>
          <button
            type="button"
            className="chat-attachment-button"
            onClick={handleAttachmentClick}
            disabled={isLoading || disabled}
            aria-label="Add attachment"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21.44 11.05L12.25 20.24C11.1243 21.3658 9.59872 22.0051 8.005 22.0051C6.41128 22.0051 4.88571 21.3658 3.76 20.24C2.63429 19.1143 1.99499 17.5887 1.99499 16C1.99499 14.4113 2.63429 12.8857 3.76 11.76L12.33 3.19C13.0806 2.43932 14.0991 2.0199 15.16 2.0199C16.2209 2.0199 17.2394 2.43932 17.99 3.19C18.7406 3.94068 19.1601 4.95913 19.1601 6.02C19.1601 7.08087 18.7406 8.09932 17.99 8.85L9.41 17.43C9.03464 17.8052 8.52519 18.015 7.995 18.015C7.46481 18.015 6.95536 17.8052 6.58 17.43C6.20464 17.0548 5.9948 16.5456 5.9948 16.015C5.9948 15.4844 6.20464 14.9752 6.58 14.6L14.54 6.63"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={attachmentTypes.join(',')}
            multiple
            className="hidden-file-input"
            aria-hidden="true"
            tabIndex={-1}
          />
        </>
      )}

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
      </button>
    </div>
  );
};

export default ChatInput;