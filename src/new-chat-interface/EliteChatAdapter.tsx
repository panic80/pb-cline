import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendToGemini } from '../api/gemini';
import { fetchTravelInstructions } from '../api/travelInstructions';
import { Message as EliteMessage } from './types';
import Chat from './Chat';
import { useTheme, ThemeProvider } from './ThemeContext';
import './styles/EliteChatAdapter.css';

/**
 * Adapter component that connects the Elite Chat interface
 * with the existing Gemini API integration
 */
// Internal component with theme access
const EliteChatAdapterContent: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  // State management
  const [messages, setMessages] = useState<EliteMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [travelInstructions, setTravelInstructions] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSimplifyMode, setIsSimplifyMode] = useState(false);

  // Load travel instructions on component mount
  useEffect(() => {
    const loadInstructions = async () => {
      try {
        const instructions = await fetchTravelInstructions();
        setTravelInstructions(instructions);
      } catch (error) {
        console.error('Failed to load travel instructions:', error);
        setNetworkError('Failed to load travel instructions. Please try again later.');
      }
    };
    
    loadInstructions();
  }, []);

  // Generate a unique message ID
  const generateMessageId = (): string => {
    return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  // Handle sending a message
  const handleSendMessage = async (messageOrContent: EliteMessage | string) => {
    // Extract content from message object or use directly if it's a string
    const content = typeof messageOrContent === 'string'
      ? messageOrContent
      : messageOrContent.content;

    if (!content.trim()) return;

    // Create user message
    const userMessage: EliteMessage = {
      id: generateMessageId(),
      content: content.trim(),
      sender: 'user',
      timestamp: Date.now(),
      status: 'sending',
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);

    // Set status to sent after a brief delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 300);

    setIsLoading(true);
    setNetworkError(null);

    try {
      if (travelInstructions) {
        console.log("Sending message to Gemini...");
        // Send message to Gemini API
        const response = await sendToGemini(
          content,
          isSimplifyMode,
          'models/gemini-2.0-flash-001',
          travelInstructions as any
        );
        
        console.log("Received response from Gemini:", response);

        if (!response || !response.text) {
          console.error("Invalid response format", response);
          throw new Error("Invalid response from Gemini API");
        }

        // Format sources (if any)
        const attachments = response.sources ?
          response.sources.map(source => ({
            id: generateMessageId(),
            type: 'document' as const,
            url: source.reference || '#',
            name: source.reference || 'Source',
            metadata: { text: source.text }
          })) :
          undefined;

        // Create assistant message with response text
        const assistantMessage: EliteMessage = {
          id: generateMessageId(),
          content: response.text || "I couldn't generate a response. Please try again.",
          sender: 'assistant',
          timestamp: Date.now(),
          status: 'delivered',
          attachments,
          metadata: {
            simplified: isSimplifyMode
          }
        };

        console.log("Adding assistant message to chat:", assistantMessage);
        
        // Update messages state using the functional form to ensure we're working with the latest state
        setMessages(prevMessages => {
          // Create a new array from the current state
          const updatedMessages = [...prevMessages];
          
          // Find and update the user message
          const userMessageIndex = updatedMessages.findIndex(msg => msg.id === userMessage.id);
          if (userMessageIndex !== -1) {
            updatedMessages[userMessageIndex] = {
              ...updatedMessages[userMessageIndex],
              status: 'delivered'
            };
          }
          
          // Add the assistant message
          updatedMessages.push(assistantMessage);
          
          // Return the updated array
          return updatedMessages;
        });
      } else {
        throw new Error("No travel instructions available");
      }
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      
      // Update network error state
      setNetworkError(
        error instanceof Error && error.message === "No travel instructions available"
          ? "I couldn't access the travel instructions. Please try again."
          : "Network error. Please check your connection and try again."
      );
      
      // Update user message status to error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
        )
      );
      
      // Add error message
      const errorMessage: EliteMessage = {
        id: generateMessageId(),
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        sender: 'assistant',
        timestamp: Date.now(),
        status: 'error',
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle copying message content
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setToastMessage("Message copied to clipboard");
        setShowToast(true);
      })
      .catch((err) => {
        console.error('Failed to copy message:', err);
        setToastMessage("Failed to copy message");
        setShowToast(true);
      });
  };

  // Handle message deletion
  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    setToastMessage("Message deleted");
    setShowToast(true);
  };

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Network error banner component
  const NetworkErrorBanner = () => (
    networkError ? (
      <div className="network-error-banner">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>{networkError}</span>
        <button onClick={() => setNetworkError(null)} aria-label="Dismiss">
          ×
        </button>
      </div>
    ) : null
  );

  // Custom header with back button, simplify toggle, and theme toggle
  const CustomHeader = () => (
    <div className="elite-header">
      <div className="header-left">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>Canadian Forces Travel Assistant</h1>
      </div>
      
      <div className="header-actions">
        {/* Simplify toggle */}
        <button
          onClick={() => setIsSimplifyMode(!isSimplifyMode)}
          className={`simplify-button ${isSimplifyMode ? 'active' : ''}`}
          aria-pressed={isSimplifyMode}
          role="switch"
          title={isSimplifyMode ? 'Turn off simplified responses' : 'Turn on simplified responses'}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{isSimplifyMode ? 'Simplified On' : 'Simplified Off'}</span>
        </button>
        
        {/* Theme toggle */}
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
    </div>
  );

  return (
    <div className="elite-chat-adapter">
      {networkError && <NetworkErrorBanner />}
      
      <Chat
        initialMessages={messages}
        onMessageSent={handleSendMessage}
        onCopyMessage={handleCopyMessage}
        onDeleteMessage={handleDeleteMessage}
        isLoading={isLoading}
        customHeader={<CustomHeader />}
        className="elite-chat-container"
      />
      
      {/* Toast notification */}
      {showToast && (
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

// Main adapter component wrapped with ThemeProvider
const EliteChatAdapter: React.FC = () => {
  return (
    <ThemeProvider>
      <EliteChatAdapterContent />
    </ThemeProvider>
  );
};

export default EliteChatAdapter;