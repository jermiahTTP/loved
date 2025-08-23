import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-border flex items-center">
      <input
        type="text"
        placeholder="Type your message..."
        className="w-full p-2 border border-input rounded-l-md bg-background"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <button
        onClick={handleSendMessage}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-r-md"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
