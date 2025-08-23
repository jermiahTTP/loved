import React, { useState } from 'react';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { Message } from './ChatMessage';

const MainLayout = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (text: string) => {
    const userMessage: Message = { text, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        text: "I'm a simulated AI response!",
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Chat Panel */}
      <div className="w-1/3 flex flex-col border-r border-border">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-primary">loved</h1>
        </div>
        <ChatHistory messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>

      {/* Preview Panel */}
      <div className="w-2/3 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Live Preview</h2>
        </div>
        <div className="flex-grow">
          <iframe
            src="about:blank"
            title="Live Preview"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
