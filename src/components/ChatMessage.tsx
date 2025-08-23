import React from 'react';

export interface Message {
  text: string;
  sender: 'user' | 'ai';
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-3 rounded-lg max-w-lg ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;
