import React from 'react';
import ChatMessage, { Message } from './ChatMessage';

interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  return (
    <div className="flex-grow p-4 overflow-y-auto">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </div>
  );
};

export default ChatHistory;
