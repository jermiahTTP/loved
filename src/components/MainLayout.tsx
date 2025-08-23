import React, { useState } from 'react';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { Message } from './ChatMessage';

const MainLayout = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = { text, sender: 'user' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    const historyForApi = newMessages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: historyForApi.slice(0, -1), // Send history without the current user message
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      const aiMessage: Message = { text: data.response, sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
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
