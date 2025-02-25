/**
 * @typedef {Object} Message
 * @property {string} sender
 * @property {string} text
 * @property {number} timestamp
 */

/**
 * @typedef {Object} ChatWindowProps
 * @property {Message[]} messages
 * @property {boolean} [isLoading]
 * @property {boolean} [isTyping]
 * @property {() => void} [onRefresh]
 * @property {boolean} [isSimplifyMode]
 */

import React, { useEffect, useRef } from 'react';

/**
 * ChatWindow component displays chat messages and typing indicator.
 * @param {ChatWindowProps} props
 */
const ChatWindow = ({ messages = [], isLoading = false, isTyping = false, onRefresh = () => {}, isSimplifyMode = false }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="flex flex-col space-y-4">
      {messages.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No messages yet. Start the conversation!
        </p>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-xs p-3 rounded-md shadow transition-transform duration-300 ease-out transform hover:scale-105 animate-fadeIn ${
              message.sender === 'user'
                ? 'self-end bg-blue-100 text-gray-900'
                : 'self-start bg-gray-100 text-gray-800'
            }`}
          >
            <p>{message.text}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))
      )}
      {isTyping && (
        <div className="max-w-xs p-3 rounded-md shadow self-end bg-blue-100 text-gray-900 animate-pulse">
          <p>Typing...</p>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
