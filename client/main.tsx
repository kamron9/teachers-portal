import React from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App";

console.log("main.tsx loaded");

const root = document.getElementById("root");
console.log("Root element:", root);

if (root) {
  try {
    createRoot(root).render(<App />);
    console.log("App rendered successfully");
  } catch (error) {
    console.error("Error rendering App:", error);
    root.innerHTML = "<h1>Error loading app</h1>";
  }
} else {
  console.error("Root element not found");
}
