import React, { useState } from 'react';
import { Message } from './ModernChat';

interface ModernChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
  isTyping?: boolean;
  onCopyMessage: (text: string) => void;
  onShareMessage: (message: Message) => void;
  onSelectQuestion: (question: string) => void;
  showAvatars?: boolean;
}

// Icons for the component
const QuestionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const MenuDotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="19" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="5" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16 6 12 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const EmptyChatIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = ({ double = false }: { double?: boolean }) => (
  double ? (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 12L11 14L15 10M9 18L11 20L15 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) : (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
);

const ErrorIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ModernChatWindow: React.FC<ModernChatWindowProps> = ({
  messages,
  isLoading = false,
  isTyping = false,
  onCopyMessage,
  onShareMessage,
  onSelectQuestion,
  showAvatars = true,
}) => {
  const [expandedSourceIds, setExpandedSourceIds] = useState<Set<number>>(new Set());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Group messages by date
  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    let currentGroup: Message[] = [];
    
    msgs.forEach((message) => {
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

  // Group messages by sender for consecutive messages
  const groupMessagesBySender = (msgs: Message[]) => {
    const groups: Message[][] = [];
    let currentGroup: Message[] = [];
    
    msgs.forEach((message, index) => {
      // Check if this is a different sender or if more than 2 minutes have passed since the last message
      const isNewSender = index === 0 || message.sender !== msgs[index - 1].sender;
      const isTimeSeparated = index > 0 && (message.timestamp - msgs[index - 1].timestamp > 2 * 60 * 1000);
      
      if (isNewSender || isTimeSeparated) {
        if (currentGroup.length > 0) {
          groups.push([...currentGroup]);
        }
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    
    return groups;
  };

  // Format date for separator
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Recent'; // Fallback for invalid dates
    }
    
    const today = new Date();
    const yesterday = new Date(today);
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

  // Format time for message timestamp
  const formatMessageTime = (timestamp: number) => {
    const date = new Date(timestamp);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ''; // Fallback for invalid dates
    }
    
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle source expansion
  const toggleSourceExpansion = (sourceIndex: number) => {
    setExpandedSourceIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sourceIndex)) {
        newSet.delete(sourceIndex);
      } else {
        newSet.add(sourceIndex);
      }
      return newSet;
    });
  };

  // Toggle all sources
  const toggleAllSources = (message: Message) => {
    if (message.sources && message.sources.length > 0) {
      if (expandedSourceIds.size === message.sources.length) {
        // If all are expanded, collapse all
        setExpandedSourceIds(new Set());
      } else {
        // Otherwise, expand all
        setExpandedSourceIds(new Set([...Array(message.sources.length).keys()]));
      }
    }
  };

  // Message actions menu handler
  const toggleMenu = (messageId: string) => {
    setActiveMenu(prevId => prevId === messageId ? null : messageId);
  };

  // Get status icon based on message status
  const getStatusIcon = (status?: string) => {
    if (!status || status === 'sent') {
      return <CheckIcon />;
    } else if (status === 'delivered') {
      return <CheckIcon double={true} />;
    } else if (status === 'read') {
      return <CheckIcon double={true} />;
    } else if (status === 'error') {
      return <ErrorIcon />;
    }
    return null;
  };

  // Group messages by date
  const dateGroups = messages.length > 0 ? groupMessagesByDate(messages) : [];

  // Suggested questions for empty state
  const suggestedQuestions = [
    "What are the travel allowance rates?",
    "How do I claim travel expenses?",
    "What documents do I need for international travel?",
    "What are the accommodation policies for Canadian Forces?"
  ];

  // Render empty state when no messages
  if (messages.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <EmptyChatIcon />
        </div>
        <h2>Canadian Forces Travel Assistant</h2>
        <p>
          I'm here to help answer your questions about Canadian Forces travel policies, 
          allowances, or procedures. Feel free to ask anything related to travel instructions.
        </p>
        
        <div className="suggested-questions">
          <h3 className="suggested-questions-title">Try asking one of these questions</h3>
          <div className="question-grid">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => onSelectQuestion(question)}
                className="question-card"
              >
                <span className="question-icon"><QuestionIcon /></span>
                <span className="question-text">{question}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Messages with date groups */}
      {dateGroups.map((dateGroup, dateIndex) => (
        <div key={`date-${dateIndex}`}>
          <div className="date-divider">
            <span className="date-divider-text">{formatDate(dateGroup.date)}</span>
          </div>
          
          {groupMessagesBySender(dateGroup.messages).map((group, groupIndex) => (
            <div key={`group-${dateIndex}-${groupIndex}`} className="message-group">
              {group.map((message, messageIndex) => (
                <div
                  key={`message-${message.id}`}
                  className={`message ${message.sender}`}
                >
                  {/* Avatar - only show for first message in group */}
                  {messageIndex === 0 && showAvatars && (
                    <div className="message-avatar">
                      {message.sender === 'user' ? (
                        <span>You</span>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" 
                            stroke="currentColor" fill="white" strokeWidth="0" />
                        </svg>
                      )}
                    </div>
                  )}
                  
                  <div className="message-content">
                    <div className={`message-bubble ${message.status === 'error' ? 'error' : ''} ${message.simplified ? 'simplified' : ''}`}>
                      {/* Message actions */}
                      <div className="message-actions">
                        <button 
                          className="message-actions-button" 
                          onClick={() => toggleMenu(message.id)}
                          aria-label="Message actions"
                          aria-expanded={activeMenu === message.id}
                        >
                          <MenuDotsIcon />
                        </button>
                        
                        {activeMenu === message.id && (
                          <div className="message-actions-menu">
                            <button 
                              className="menu-item"
                              onClick={() => {
                                onCopyMessage(message.text);
                                toggleMenu(message.id);
                              }}
                            >
                              <CopyIcon /> Copy
                            </button>
                            <button 
                              className="menu-item"
                              onClick={() => {
                                onShareMessage(message);
                                toggleMenu(message.id);
                              }}
                            >
                              <ShareIcon /> Share
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Message text */}
                      <div className="message-text">{message.text}</div>
                      
                      {/* Message sources */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="message-sources">
                          <button
                            className="sources-toggle"
                            onClick={() => toggleAllSources(message)}
                          >
                            {expandedSourceIds.size === message.sources.length ? (
                              <>
                                <MinusIcon /> 
                                <span>Hide all {message.sources.length} sources</span>
                              </>
                            ) : (
                              <>
                                <PlusIcon /> 
                                <span>View all {message.sources.length} sources</span>
                              </>
                            )}
                          </button>
                          
                          {message.sources.map((source, sourceIndex) => (
                            <div key={sourceIndex} className="source-item">
                              <button
                                className="source-header"
                                onClick={() => toggleSourceExpansion(sourceIndex)}
                                aria-expanded={expandedSourceIds.has(sourceIndex)}
                              >
                                <span>{source.reference || `Source ${sourceIndex + 1}`}</span>
                                <span className={expandedSourceIds.has(sourceIndex) ? 'rotate-180' : ''}>
                                  <ChevronIcon />
                                </span>
                              </button>
                              
                              {expandedSourceIds.has(sourceIndex) && source.text && (
                                <div className="source-content">
                                  "{source.text}"
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Message metadata */}
                    <div className="message-meta">
                      <span className="message-time">{formatMessageTime(message.timestamp)}</span>
                      {message.sender === 'user' && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="message bot">
          {showAvatars && (
            <div className="message-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" 
                  stroke="currentColor" fill="white" strokeWidth="0" />
              </svg>
            </div>
          )}
          <div className="typing-indicator">
            <div className="typing-dots">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Typing indicator */}
      {isTyping && !isLoading && (
        <div className="message user">
          {showAvatars && (
            <div className="message-avatar">
              <span>You</span>
            </div>
          )}
          <div className="message-content">
            <div className="message-bubble">
              <div className="message-text">Typing...</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModernChatWindow;