import React, { useRef } from 'react';
import { Message } from './types';
import { useTheme } from './ThemeContext';
import './styles/ChatMessage.css';

export interface ChatMessageProps {
  message: Message;
  isConsecutive?: boolean;
  showAvatar?: boolean;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isConsecutive = false,
  showAvatar = true,
  className = '',
}) => {
  const { theme } = useTheme();
  const messageRef = useRef<HTMLDivElement>(null);
  
  // Format timestamp to human-readable time
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
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
      <div className="message-content">
        <div className="message-bubble">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;