import React, { useState, useRef, useEffect } from 'react';
import { Message } from './types';
import { useTheme } from './ThemeContext';
import './styles/ChatMessage.css';

export interface ChatMessageProps {
  message: Message;
  isConsecutive?: boolean;
  showAvatar?: boolean;
  onCopy?: (content: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isConsecutive = false,
  showAvatar = true,
  onCopy,
  onDelete,
  className = '',
}) => {
  const { theme } = useTheme();
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  
  // Format timestamp to human-readable time
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle click outside to close actions menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  // Avatar component
  const Avatar = () => {
    if (message.sender === 'user') {
      return (
        <div className="chat-avatar user-avatar" aria-hidden="true">
          <span>U</span>
        </div>
      );
    }

    return (
      <div className="chat-avatar assistant-avatar" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 16V12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8H12.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  // Message actions menu
  const MessageActions = () => (
    <div className="message-actions" ref={actionsRef}>
      <button
        className="actions-toggle"
        onClick={() => setShowActions(!showActions)}
        aria-label="Message actions"
        aria-expanded={showActions}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {showActions && (
        <div className="actions-menu" role="menu">
          {onCopy && (
            <button
              onClick={() => {
                onCopy(message.content);
                setShowActions(false);
              }}
              className="action-item"
              role="menuitem"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 12H16M8 16H16M8 8H16M4 4H20V20H4V4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copy
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => {
                onDelete(message.id);
                setShowActions(false);
              }}
              className="action-item delete"
              role="menuitem"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );

  // Status indicator
  const StatusIndicator = () => {
    if (!message.status || message.sender !== 'user') return null;

    switch (message.status) {
      case 'sending':
        return (
          <span className="message-status sending" aria-label="Sending">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        );
      case 'sent':
        return (
          <span className="message-status sent" aria-label="Sent">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        );
      case 'delivered':
        return (
          <span className="message-status delivered" aria-label="Delivered">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 12L10 15L17 8M3 12L6 15L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        );
      case 'read':
        return (
          <span className="message-status read" aria-label="Read">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 12L10 15L17 8M3 12L6 15L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        );
      case 'error':
        return (
          <span className="message-status error" aria-label="Error">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        );
      default:
        return null;
    }
  };

  const messageClass = `chat-message ${message.sender === 'user' ? 'user' : 'assistant'} ${
    isConsecutive ? 'consecutive' : ''
  } ${message.status === 'error' ? 'error' : ''} ${className}`;

  return (
    <div 
      className={messageClass} 
      ref={messageRef}
      data-sender={message.sender}
    >
      {showAvatar && !isConsecutive && (
        <div className="avatar-container">
          <Avatar />
        </div>
      )}
      
      <div className="message-content">
        <div className="message-bubble">
          {message.content}
          <MessageActions />
        </div>
        
        <div className="message-footer">
          <span className="message-time">{formatTime(message.timestamp)}</span>
          <StatusIndicator />
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;