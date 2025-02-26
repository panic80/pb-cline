import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ImprovedChatWindow from '../components/modern/ImprovedChatWindow';
import ModernChatInput from '../components/modern/ModernChatInput';
import '../styles/unified-chat.css';

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

export interface DemoMessage {
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

const ImprovedChatDemo: React.FC = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample messages with nested content for demonstration
  const sampleMessages: DemoMessage[] = [
    {
      id: 'msg-1',
      sender: 'user',
      text: 'what time do i get lunch',
      timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
      status: 'read'
    },
    {
      id: 'msg-2',
      sender: 'bot',
      text: 'The instructions do not provide a specific time for lunch.\n\nReason: The document states that meal allowances are provided for duty travel but does not specify any timings.',
      timestamp: Date.now() - 1000 * 60 * 4, // 4 minutes ago
      status: 'delivered',
      sources: [
        {
          reference: '5. Meals and Incidentals',
          text: '5.1 Meal allowances are provided for duty travel.'
        }
      ]
    },
    {
      id: 'msg-3',
      sender: 'user',
      text: 'what time are meals served?',
      timestamp: Date.now() - 1000 * 60 * 2, // 2 minutes ago
      status: 'delivered'
    },
    {
      id: 'msg-4',
      sender: 'bot',
      text: 'The instructions do not provide specific times when meals are served. The document only mentions that meal allowances are provided for duty travel but does not include any schedule or timing information for when meals are served.',
      timestamp: Date.now() - 1000 * 60, // 1 minute ago
      status: 'delivered',
      simplified: true,
      sources: [
        {
          reference: '5. Meals and Incidentals',
          text: '5.1 Meal allowances are provided for duty travel.'
        },
        {
          reference: 'Travel Policy Document',
          text: 'Section 3.4: Personnel on duty travel are entitled to meal allowances as prescribed in the Financial Administration Manual.'
        },
        {
          reference: 'Canadian Forces Administrative Order',
          text: 'CFAO 209-13: Reimbursement for meals shall be provided in accordance with Treasury Board guidelines for government travel.'
        }
      ]
    }
  ];

  // State management
  const [messages, setMessages] = useState<DemoMessage[]>(sampleMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSimplifyMode, setIsSimplifyMode] = useState<boolean>(true);
  const [input, setInput] = useState<string>("");
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  const [showAvatars, setShowAvatars] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  // Apply theme class to document
  useEffect(() => {
    // Remove both classes first
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.remove('light');
    document.body.classList.remove('dark');
    document.body.classList.remove('light');
    
    // Add the appropriate class
    document.documentElement.classList.add(theme);
    document.body.classList.add(theme);
    
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

  // Demo send message handler
  const handleSend = async () => {
    if (input.trim()) {
      // Create and add user message
      const userMessage: DemoMessage = {
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
      
      // Simulate bot response after delay
      setTimeout(() => {
        const botMessage: DemoMessage = {
          id: generateMessageId(),
          sender: 'bot',
          text: "This is a simulated response to demonstrate the improved chat bubble design with proper spacing and nesting. The instructions do not provide specific times for meals.",
          timestamp: Date.now(),
          sources: [
            {
              reference: 'Travel Policy Document',
              text: 'This is a sample source citation that demonstrates how source references are now properly displayed without overlapping with the main message bubble.'
            }
          ],
          simplified: isSimplifyMode,
          status: 'delivered'
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        setTimeout(scrollToBottom, 100);
      }, 1500);
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages(sampleMessages);
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
  const handleShareMessage = (message: DemoMessage) => {
    setToastMessage("Share functionality demo");
    setShowToast(true);
  };

  // Handle suggested question selection
  const handleSelectQuestion = (question: string) => {
    setInput(question);
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
          <span>Improved Chat Bubbles Demo</span>
        </div>
        
        <div className="header-actions">
          {/* Clear chat button */}
          <button
            onClick={clearChat}
            className="icon-button"
            aria-label="Reset demo"
            title="Reset demo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* Avatar toggle button */}
          <button
            onClick={() => setShowAvatars(!showAvatars)}
            className={`icon-button ${showAvatars ? 'active' : ''}`}
            aria-label={showAvatars ? 'Hide Avatars' : 'Show Avatars'}
            title={showAvatars ? 'Hide Avatars' : 'Show Avatars'}
            aria-pressed={showAvatars}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
        <ImprovedChatWindow
          messages={messages}
          isLoading={isLoading}
          isTyping={isTyping}
          onCopyMessage={handleCopyMessage}
          onShareMessage={handleShareMessage}
          onSelectQuestion={handleSelectQuestion}
          showAvatars={showAvatars}
        />
        
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="toast-message">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedChatDemo;