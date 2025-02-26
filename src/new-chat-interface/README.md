# Elite Chat Interface

A professional, elegant, and minimalist chat interface with seamless light/dark mode support.

## Features

- **Modern Design**: Clean, professional, and elegant aesthetic
- **Theme Support**: Seamlessly switches between light and dark modes
- **Responsive**: Fully responsive design works on all devices
- **Accessibility**: Built with accessibility in mind
- **Message Groups**: Intelligently groups messages by date and sender
- **Message Actions**: Copy and delete functionality
- **Status Indicators**: Visual indicators for message status (sending, sent, delivered, read, error)
- **Animations**: Smooth transitions and animations for a polished feel

## Structure

```
/new-chat-interface/
├── styles/                 # CSS files
│   ├── Chat.css            # Base styles and variables
│   ├── ChatMessage.css     # Message component styles
│   ├── ChatInput.css       # Input component styles
│   ├── ChatWindow.css      # Window component styles
│   └── EliteChatAdapter.css # Adapter component styles
├── ThemeContext.tsx        # Theme provider and hook
├── types.ts                # TypeScript type definitions
├── ChatMessage.tsx         # Individual message component
├── ChatInput.tsx           # Message input component
├── ChatWindow.tsx          # Message display component
├── Chat.tsx                # Main chat component
├── EliteChatAdapter.tsx    # Adapter for integration
├── index.ts                # Component exports
└── README.md               # Documentation
```

## Usage

The chat interface can be used in two ways:

### 1. Import the main Chat component

```tsx
import { Chat } from './new-chat-interface';

function App() {
  return (
    <Chat 
      apiEndpoint="/api/messages" // Optional API endpoint
      initialMessages={[]} // Optional initial messages
      showAvatars={true} // Optional, defaults to true
      onMessageSent={(message) => console.log(message)} // Optional callback
      onError={(error) => console.error(error)} // Optional error handler
    />
  );
}
```

### 2. Use individual components for custom layouts

```tsx
import { 
  ThemeProvider, 
  ChatWindow, 
  ChatInput 
} from './new-chat-interface';
import { Message } from './new-chat-interface/types';

function CustomChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handleSendMessage = (content: string) => {
    // Handle sending message...
  };
  
  return (
    <ThemeProvider>
      <div className="custom-container">
        <ChatWindow 
          messages={messages}
          showAvatars={true}
        />
        <ChatInput 
          onSendMessage={handleSendMessage}
        />
      </div>
    </ThemeProvider>
  );
}
```

## Customization

The interface is highly customizable through CSS variables. The base variables are defined in `styles/Chat.css` and can be overridden to match your application's design system.

```css
:root {
  --color-accent-primary: #4c6ef5; /* Change the primary accent color */
  --color-user-bubble: #4c6ef5; /* Change user message bubble color */
  --chat-border-radius: 8px; /* Adjust border radius */
  /* ... other variables */
}
```

## Browser Support

This interface is built with modern CSS and JavaScript features and is compatible with:

- Chrome/Edge 80+
- Firefox 75+
- Safari 13.1+
- iOS Safari 13.4+
- Android Browser 80+

## Accessibility

The interface is built with accessibility in mind:

- Proper ARIA attributes
- Keyboard navigation support
- High contrast mode support
- Screen reader compatibility
- Focus management

## License

MIT License