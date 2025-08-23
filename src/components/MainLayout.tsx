import React from 'react';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Chat Panel */}
      <div className="w-1/3 flex flex-col border-r border-border">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-primary">loved</h1>
        </div>
        <div className="flex-grow p-4">
          {/* Chat content will go here */}
          <p>Chat interface placeholder</p>
        </div>
        <div className="p-4 border-t border-border">
          {/* Chat input will go here */}
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-2 border border-input rounded bg-background"
          />
        </div>
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
