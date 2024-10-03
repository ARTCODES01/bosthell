import React, { useEffect } from "react";

const DisableInspect = () => {
  useEffect(() => {
    // Disable right-click
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+J, etc.
    const disableDevTools = (e) => {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U (View Page Source)
      ) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener("keydown", disableDevTools);

    return () => {
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
      window.removeEventListener("keydown", disableDevTools);
    };
  }, []);

  return null;
};

// Example component to show that DisableInspect is working
const App = () => {
  return (
    <div>
      <DisableInspect />
      <h1>Hello, welcome to my secure site!</h1>
      <p>Right-click and dev tools are disabled here!</p>
    </div>
  );
};

export default App;
