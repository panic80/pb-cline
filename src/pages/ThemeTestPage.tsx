import React from 'react';
import Chat from '../new-chat-interface/Chat';
import { Message } from '../new-chat-interface/types';

const ThemeTestPage: React.FC = () => {
  const initialMessages: Message[] = [
    {
      id: 'msg-1',
      content: 'Hello! How can I help you today?',
      sender: 'assistant',
      timestamp: Date.now() - 60000,
      status: 'delivered',
    },
    {
      id: 'msg-2',
      content: 'I\'d like to test the light and dark theme functionality.',
      sender: 'user',
      timestamp: Date.now() - 30000,
      status: 'delivered',
    },
    {
      id: 'msg-3',
      content: 'Great! The theme can be toggled by clicking the sun/moon icon in the header. This lets you switch between light and dark mode.',
      sender: 'assistant',
      timestamp: Date.now() - 15000,
      status: 'delivered',
    }
  ];

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Chat 
        initialMessages={initialMessages}
        onMessageSent={(message) => {
          console.log('Message sent:', message);
        }}
      />
    </div>
  );
};

export default ThemeTestPage;