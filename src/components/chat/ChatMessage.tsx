import React from 'react';
import { formatMessageTime } from '../../utils/chatUtils';
import './ChatMessage.css';

interface ChatMessageProps {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  isOwn: boolean;
  avatar?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  sender,
  timestamp,
  isOwn,
  avatar,
}) => {
  return (
    <div className={`message-container ${isOwn ? 'own-message' : ''}`}>
      {!isOwn && (
        <div className="avatar">
          {avatar ? (
            <img src={avatar} alt={sender} />
          ) : (
            <div className="avatar-placeholder">{sender.charAt(0).toUpperCase()}</div>
          )}
        </div>
      )}
      <div className="message-content">
        {!isOwn && <div className="sender-name">{sender}</div>}
        <div className="message-bubble">
          <p>{content}</p>
          <span className="message-time">{formatMessageTime(timestamp)}</span>
        </div>
      </div>
    </div>
  );
};
