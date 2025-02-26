import React, { useState, useEffect, useCallback } from 'react';
import { Message } from './types';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import { useTheme, ThemeProvider } from './ThemeContext';
import './styles/Chat.css';

interface ChatProps {
  apiEndpoint?: string;
  initialMessages?: Message[];
  showAvatars?: boolean;
  className?: string;
  onMessageSent?: (message: Message | string) => void;
  onError?: (error: Error) => void;
  isLoading?: boolean;
  customHeader?: React.ReactNode;
  onCopyMessage?: (content: string) => void;
  onDeleteMessage?: (id: string) => void;
}

// Generate unique ID for messages
const generateId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const ChatComponent: React.FC<ChatProps> = ({
  apiEndpoint,
  initialMessages = [],
  showAvatars = true,
  className = '',
  onMessageSent,
  onError,
  isLoading: externalLoading,
  customHeader,
  onCopyMessage: externalCopyHandler,
  onDeleteMessage: externalDeleteHandler,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(externalLoading || false);
  
  // Sync with external messages when initialMessages changes
  useEffect(() => {
    console.log("initialMessages changed:", initialMessages);
    setMessages(initialMessages);
  }, [initialMessages]);
  
  // Update loading state when externally controlled
  useEffect(() => {
    if (externalLoading !== undefined) {
      setIsLoading(externalLoading);
    }
  }, [externalLoading]);
  const [copyToastVisible, setCopyToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: generateId(),
      content: content.trim(),
      sender: 'user',
      timestamp: Date.now(),
      status: 'sending',
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);

    // Update status to sent
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 500);

    // Call onMessageSent callback if provided
    if (onMessageSent) {
      console.log("Calling onMessageSent with:", userMessage);
      // Use Promise.resolve to handle both synchronous and asynchronous onMessageSent
      try {
        await Promise.resolve(onMessageSent(userMessage));
      } catch (error) {
        console.error("Error in onMessageSent callback:", error);
      }
    }

    // If apiEndpoint is provided, send message to API
    if (apiEndpoint) {
      setIsLoading(true);

      try {
        // Simulate API call - replace with actual implementation
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Create mock response - replace with actual API response handling
        const assistantMessage: Message = {
          id: generateId(),
          content: `This is a mock response to: "${content}"`,
          sender: 'assistant',
          timestamp: Date.now(),
          status: 'delivered',
        };

        // Add assistant message to chat
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        // Handle error
        console.error('Error sending message:', error);
        
        // Add error message
        const errorMessage: Message = {
          id: generateId(),
          content: 'Sorry, an error occurred while sending your message. Please try again.',
          sender: 'assistant',
          timestamp: Date.now(),
          status: 'error',
        };
        
        setMessages((prev) => [...prev, errorMessage]);
        
        // Call onError callback if provided
        if (onError && error instanceof Error) {
          onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Clear all messages
  const handleClearChat = useCallback(() => {
    setMessages([]);
  }, []);

  // Handle copy message
  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setToastMessage('Message copied to clipboard');
        setCopyToastVisible(true);
        // Call external copy handler if provided
        if (externalCopyHandler) {
          externalCopyHandler(content);
        }
      })
      .catch(() => {
        setToastMessage('Failed to copy message');
        setCopyToastVisible(true);
      });
  }, [externalCopyHandler]);

  // Handle delete message
  const handleDeleteMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    setToastMessage('Message deleted');
    setCopyToastVisible(true);
    // Call external delete handler if provided
    if (externalDeleteHandler) {
      externalDeleteHandler(id);
    }
  }, [externalDeleteHandler]);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (copyToastVisible) {
      const timer = setTimeout(() => {
        setCopyToastVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [copyToastVisible]);

  return (
    <div
      className={`elite-chat-container ${className}`}
    >
      {/* Header - use custom header if provided, otherwise use default */}
      {customHeader ? (
        customHeader
      ) : (
        <header className="chat-header">
          <h1>Elite Chat</h1>
          
          <div className="header-actions">
            <button
              className="action-button clear-button"
              onClick={handleClearChat}
              aria-label="Clear chat"
              title="Clear chat"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 6H21M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6M10 11V17M14 11V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            <button
              className="action-button theme-button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle
                    cx="12"
                    cy="12"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </header>
      )}

      {/* Chat window */}
      <main className="chat-main">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          showAvatars={showAvatars}
          onCopyMessage={handleCopyMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      </main>

      {/* Input area */}
      <footer className="chat-footer">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Type a message..."
        />
      </footer>

      {/* Toast notification */}
      {copyToastVisible && (
        <div className="toast-notification" role="alert">
          <div className="toast-content">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrap component with ThemeProvider
export const Chat: React.FC<ChatProps> = (props) => {
  return (
    <ThemeProvider>
      <ChatComponent {...props} />
    </ThemeProvider>
  );
};

export default Chat;