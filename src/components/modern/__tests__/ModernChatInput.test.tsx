import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModernChatInput from '../ModernChatInput';

describe('ModernChatInput Component', () => {
  const mockProps = {
    input: '',
    setInput: vi.fn(),
    handleSend: vi.fn(),
    onTyping: vi.fn(),
    isLoading: false,
    maxLength: 500
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with placeholder text', () => {
    render(<ModernChatInput {...mockProps} />);
    expect(screen.getByPlaceholderText('Ask about Canadian Forces travel instructions...')).toBeInTheDocument();
  });

  it('updates input when typing', () => {
    render(<ModernChatInput {...mockProps} />);
    const textarea = screen.getByPlaceholderText('Ask about Canadian Forces travel instructions...');
    
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    
    expect(mockProps.setInput).toHaveBeenCalledWith('Hello');
    expect(mockProps.onTyping).toHaveBeenCalledWith('Hello');
  });

  it('calls handleSend when send button is clicked', () => {
    const props = {
      ...mockProps,
      input: 'Test message',
    };
    
    render(<ModernChatInput {...props} />);
    const sendButton = screen.getByRole('button', { name: /send message/i });
    
    fireEvent.click(sendButton);
    
    expect(mockProps.handleSend).toHaveBeenCalled();
  });

  it('disables send button when input is empty', () => {
    render(<ModernChatInput {...mockProps} />);
    const sendButton = screen.getByRole('button', { name: /send message/i });
    
    expect(sendButton).toBeDisabled();
  });

  it('disables send button when loading', () => {
    const props = {
      ...mockProps,
      input: 'Test message',
      isLoading: true,
    };
    
    render(<ModernChatInput {...props} />);
    const sendButton = screen.getByRole('button', { name: /sending/i });
    
    expect(sendButton).toBeDisabled();
  });

  it('shows character count', () => {
    const props = {
      ...mockProps,
      input: 'Hello',
    };
    
    render(<ModernChatInput {...props} />);
    
    expect(screen.getByText('5/500')).toBeInTheDocument();
  });

  it('sends message on Enter key press without Shift', () => {
    const props = {
      ...mockProps,
      input: 'Test message',
    };
    
    render(<ModernChatInput {...props} />);
    const textarea = screen.getByPlaceholderText('Ask about Canadian Forces travel instructions...');
    
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: false });
    
    expect(mockProps.handleSend).toHaveBeenCalled();
  });

  it('does not send message on Shift+Enter key press', () => {
    const props = {
      ...mockProps,
      input: 'Test message',
    };
    
    render(<ModernChatInput {...props} />);
    const textarea = screen.getByPlaceholderText('Ask about Canadian Forces travel instructions...');
    
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: true });
    
    expect(mockProps.handleSend).not.toHaveBeenCalled();
  });
});