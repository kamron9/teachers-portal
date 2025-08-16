import React from "react";
import { createRoot } from "react-dom/client";
import "./global.css";

function SimpleApp() {
  return (
    <div style={{ padding: "20px", backgroundColor: "lightgreen" }}>
      <h1>Simple App Loading!</h1>
      <p>React is working now!</p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<SimpleApp />);
