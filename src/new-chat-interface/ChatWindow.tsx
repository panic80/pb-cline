import React, { useRef, useEffect, useState } from 'react';
import { Message } from './types';
import ChatMessage from './ChatMessage';
import { useTheme } from './ThemeContext';
import './styles/ChatWindow.css';

export interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading = false,
  className = '',
}) => {
  const { theme } = useTheme();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [hasScrolledUp, setHasScrolledUp] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Check if a message is consecutive (part of a sequence from the same sender)
  const isConsecutiveMessage = (index: number): boolean => {
    if (index === 0) return false;
    return messages[index].sender === messages[index - 1].sender;
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    let currentGroup: Message[] = [];
    
    if (!messages || messages.length === 0) {
      return groups;
    }
    
    messages.forEach((message) => {
      if (!message.timestamp) {
        console.warn("Message missing timestamp:", message);
        message.timestamp = Date.now(); // Add default timestamp
      }
      
      const messageDate = new Date(message.timestamp).toLocaleDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: [...currentGroup]
          });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push({
        date: currentDate,
        messages: currentGroup
      });
    }
    
    return groups;
  };

  // Format date for separator
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Handle container scroll
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
    
    if (isAtBottom) {
      setAutoScroll(true);
      setHasScrolledUp(false);
      setShowScrollButton(false);
    } else {
      setAutoScroll(false);
      setHasScrolledUp(true);
      setShowScrollButton(true);
    }
  };

  // Scroll to bottom of container
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior
      });
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (autoScroll && chatContainerRef.current) {
      scrollToBottom(messages.length > 0 ? 'smooth' : 'auto');
    }
  }, [messages, autoScroll]);

  // Scroll down button click handler
  const handleScrollToBottomClick = () => {
    scrollToBottom();
    setAutoScroll(true);
    setHasScrolledUp(false);
    setShowScrollButton(false);
  };

  // Empty state component
  const EmptyState = () => (
    <div className="chat-empty-state">
      <div className="empty-state-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11499 17.053 3.99476 18.5291 5.47086C20.0052 6.94696 20.885 8.91565 21 11V11.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2>No messages yet</h2>
      <p>Start a conversation by sending a message below.</p>
    </div>
  );

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="chat-loading-indicator">
      <div className="typing-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );

  const messageGroups = groupMessagesByDate();

  return (
    <div
      className={`chat-window-container ${className}`}
    >
      <div
        className="chat-messages"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {messageGroups.map((group, groupIndex) => (
              <div key={`date-group-${groupIndex}`} className="message-date-group">
                <div className="date-separator">
                  <span>{formatDate(group.date)}</span>
                </div>
                
                {group.messages.map((message, messageIndex) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isConsecutive={isConsecutiveMessage(
                      messages.indexOf(message)
                    )}
                  />
                ))}
              </div>
            ))}

            {/* Show loading indicator if isLoading is true */}
            {isLoading && <LoadingIndicator />}
          </>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          className="scroll-to-bottom"
          onClick={handleScrollToBottomClick}
          aria-label="Scroll to bottom"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 14L12 21L5 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 5L12 12L5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatWindow;