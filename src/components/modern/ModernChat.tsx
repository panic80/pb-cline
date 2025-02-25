import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernChatWindow from './ModernChatWindow';
import ModernChatInput from './ModernChatInput';
import { sendToGemini } from '../../api/gemini';
import { fetchTravelInstructions } from '../../api/travelInstructions';
import '../../styles/modern-chat.css';

// Icons
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ThemeIcon = ({ isDark }: { isDark: boolean }) => (
  isDark ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

const AvatarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClearIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SuccessIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SimplifyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  status?: 'sent' | 'delivered' | 'read' | 'error';
  sources?: Array<{
    text?: string;
    reference?: string;
  }>;
  simplified?: boolean;
}

const ModernChat: React.FC = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSimplifyMode, setIsSimplifyMode] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [travelInstructions, setTravelInstructions] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  const [showAvatars, setShowAvatars] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [conversationStarted, setConversationStarted] = useState<boolean>(false);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

  // Load travel instructions on component mount
  useEffect(() => {
    const loadInstructions = async () => {
      try {
        const instructions = await fetchTravelInstructions();
        setTravelInstructions(instructions);
      } catch (error) {
        console.error('Failed to load travel instructions:', error);
      }
    };
    
    loadInstructions();
  }, []);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Update conversation started flag
  useEffect(() => {
    if (messages.length > 0 && !conversationStarted) {
      setConversationStarted(true);
    }
  }, [messages, conversationStarted]);

  // Handle scroll events to show/hide scroll-to-bottom button
  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (!container) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp && messages.length > 0);
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages.length]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Generate unique ID for messages
  const generateMessageId = () => {
    return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Send message handler
  const handleSend = async () => {
    if (input.trim()) {
      // Create and add user message
      const userMessage: Message = {
        id: generateMessageId(),
        sender: 'user',
        text: input,
        timestamp: Date.now(),
        status: 'sent'
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      setIsTyping(false);
      setIsLoading(true);
      
      // Scroll to bottom after sending message
      setTimeout(scrollToBottom, 100);
      
      try {
        // Send message to Gemini API if travel instructions are loaded
        if (travelInstructions) {
          // Type assertion to handle the TypeScript error
          const response = await sendToGemini(input, isSimplifyMode, 'models/gemini-2.0-flash-001', travelInstructions as any);
          
          // Create bot message with response
          const botMessage: Message = {
            id: generateMessageId(),
            sender: 'bot',
            text: response.text,
            timestamp: Date.now(),
            sources: response.sources,
            simplified: isSimplifyMode,
            status: 'delivered'
          };
          
          setMessages(prev => [...prev, botMessage]);
          setTimeout(scrollToBottom, 100);
        } else {
          // Fallback if travel instructions aren't loaded
          setTimeout(() => {
            const fallbackMessage: Message = {
              id: generateMessageId(),
              sender: 'bot',
              text: "I'm sorry, I couldn't access the travel instructions. Please try again later.",
              timestamp: Date.now(),
              status: 'error'
            };
            
            setMessages(prev => [...prev, fallbackMessage]);
            setTimeout(scrollToBottom, 100);
          }, 1000);
        }
      } catch (error) {
        console.error('Error sending message to Gemini:', error);
        
        // Add error message
        const errorMessage: Message = {
          id: generateMessageId(),
          sender: 'bot',
          text: "I'm sorry, I encountered an error processing your request. Please try again.",
          timestamp: Date.now(),
          status: 'error'
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setTimeout(scrollToBottom, 100);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    setConversationStarted(false);
  };

  // Typing indicator handler
  const onTyping = (value: string) => {
    setIsTyping(value.length > 0);
  };

  // Handle copy message
  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setToastMessage("Message copied to clipboard");
        setShowToast(true);
      })
      .catch(err => {
        console.error('Failed to copy message:', err);
        setToastMessage("Failed to copy message");
        setShowToast(true);
      });
  };

  // Handle share message
  const handleShareMessage = (message: Message) => {
    // In a real app, this would open a share dialog
    setToastMessage("Share functionality coming soon");
    setShowToast(true);
  };

  // Handle suggested question selection
  const handleSelectQuestion = (question: string) => {
    setInput(question);
    // Optional: Auto-send the question
    // setTimeout(() => handleSend(), 500);
  };

  return (
    <div className="modern-chat">
      {/* Header */}
      <header className="modern-chat-header">
        <div className="header-title">
          <button
            onClick={() => navigate(-1)}
            className="icon-button"
            aria-label="Go back"
          >
            <BackIcon />
          </button>
          <div className="app-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" 
                stroke="currentColor" fill="white" strokeWidth="0" />
            </svg>
          </div>
          <span>Canadian Forces Travel Assistant</span>
        </div>
        
        <div className="header-actions">
          {/* Clear chat button - only show if conversation started */}
          {conversationStarted && (
            <button
              onClick={clearChat}
              className="icon-button"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <ClearIcon />
            </button>
          )}
          
          {/* Avatar toggle button */}
          <button
            onClick={() => setShowAvatars(!showAvatars)}
            className={`icon-button ${showAvatars ? 'active' : ''}`}
            aria-label={showAvatars ? 'Hide Avatars' : 'Show Avatars'}
            title={showAvatars ? 'Hide Avatars' : 'Show Avatars'}
            aria-pressed={showAvatars}
          >
            <AvatarIcon />
          </button>
          
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="icon-button"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <ThemeIcon isDark={theme === 'dark'} />
          </button>
        </div>
      </header>

      {/* Chat window */}
      <main className="messages-container">
        <ModernChatWindow
          messages={messages}
          isLoading={isLoading}
          isTyping={isTyping}
          onCopyMessage={handleCopyMessage}
          onShareMessage={handleShareMessage}
          onSelectQuestion={handleSelectQuestion}
          showAvatars={showAvatars}
        />
        
        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button 
            className="scroll-bottom visible" 
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        
        {/* Invisible div for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </main>

      {/* Chat input and controls */}
      <div className="feature-controls">
        <button
          onClick={() => setIsSimplifyMode(!isSimplifyMode)}
          className={`feature-toggle ${isSimplifyMode ? 'active' : ''}`}
          aria-pressed={isSimplifyMode}
          role="switch"
          title={isSimplifyMode ? 'Turn off simplified responses' : 'Turn on simplified responses'}
        >
          <SimplifyIcon />
          <span>{isSimplifyMode ? 'Simplified On' : 'Simplified Off'}</span>
        </button>
      </div>
      
      <div className="input-container">
        <ModernChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          onTyping={onTyping}
          isLoading={isLoading}
          maxLength={500}
        />
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="toast-container">
          <div className="toast">
            <span className="toast-icon">
              <SuccessIcon />
            </span>
            <span className="toast-message">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernChat;