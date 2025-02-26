# Light and Dark Theme Implementation for Chat Interface

This document outlines the implementation of light and dark themes for the chat interface in the `/new-chat-interface` directory.

## Theme Architecture

The theming system consists of:

1. **ThemeContext** (`ThemeContext.tsx`): Provides theme state management with React Context API
2. **CSS Variables**: Defines styling for both light and dark modes using CSS variables
3. **Theme Toggle**: UI component for users to switch between themes

## How Theming Works

### Theme State Management

The `ThemeContext.tsx` file manages the theme state:

- Creates a context to store the current theme ('light'|'dark')
- Provides a toggle function to switch between themes
- Persists theme preference in localStorage
- Respects user's system preference for initial theme
- Applies a 'dark' class to the document's root element when dark theme is active
- Also sets a 'data-theme' attribute to support compatibility with the main application

### CSS Structure

Theme styling is implemented using CSS variables:

- Base variables defined in `:root` (light theme by default)
- Dark theme variables defined in `:root.dark` (applied when the dark class is present)
- For compatibility, same variables are also defined for `[data-theme="dark"]`

### Integration with Existing App

The theming system supports two methods of theme application:

1. **Class-based**: Using the `.dark` class on the root element
2. **Attribute-based**: Using the `data-theme="dark"` attribute

This dual approach ensures compatibility with both the new chat interface components and the existing application that uses the data-theme attribute.

### Components Integration

All chat components use the `useTheme()` hook to access current theme and toggle functionality:

- `Chat.tsx`: Main container component, includes theme toggle button
- `ChatWindow.tsx`: Message display area
- `ChatMessage.tsx`: Individual message styling
- `ChatInput.tsx`: Text input area

## Testing

Visit `/theme-test` to see a demonstration of the theme functionality. This page displays a simple chat interface with some sample messages and allows toggling between light and dark modes.

## Usage in Other Components

To use the theming system in other components:

1. Import the ThemeProvider and useTheme hook:
   ```tsx
   import { useTheme, ThemeProvider } from '../new-chat-interface/ThemeContext';
   ```

2. Wrap your component with ThemeProvider if not already inside one:
   ```tsx
   <ThemeProvider>
     <YourComponent />
   </ThemeProvider>
   ```

3. Use the useTheme hook to access theme state:
   ```tsx
   const { theme, toggleTheme } = useTheme();
   ```

4. Style your component using CSS variables defined in Chat.css

## Key Improvements

The implementation includes the following key improvements:

1. **Cross-compatibility**: Works with both class-based and attribute-based theme application
2. **System preference detection**: Automatically respects the user's system preference for light/dark mode
3. **Persistence**: Saves user preference in localStorage
4. **Smooth transitions**: CSS transitions for a smooth visual experience when switching themes
5. **Comprehensive styling**: All components are styled appropriately for both light and dark modes