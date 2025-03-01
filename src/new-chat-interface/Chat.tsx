import React, { useState, useEffect } from 'react';
import { Message } from './types';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import ThemeToggle from './ThemeToggle';
import { useTheme, ThemeProvider } from './ThemeContext';
import './styles/Chat.css';

interface ChatProps {
  apiEndpoint?: string;
  initialMessages?: Message[];
  className?: string;
  onMessageSent?: (message: Message | string) => void;
  onError?: (error: Error) => void;
  isLoading?: boolean;
}

// Generate unique ID for messages
const generateId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const ChatComponent: React.FC<ChatProps> = ({
  apiEndpoint,
  initialMessages = [],
  className = '',
  onMessageSent,
  onError,
  isLoading: externalLoading,
}) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(externalLoading || false);
  
  // Sync with external messages when initialMessages changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);
  
  // Update loading state when externally controlled
  useEffect(() => {
    if (externalLoading !== undefined) {
      setIsLoading(externalLoading);
    }
  }, [externalLoading]);

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

  return (
    <div className={`simple-chat-container ${className}`}>
      <div className="theme-toggle-wrapper">
        <ThemeToggle />
      </div>
      {/* Chat window */}
      <main className="chat-main">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
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