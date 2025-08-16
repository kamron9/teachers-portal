import { createRoot } from "react-dom/client";
import App from "./App";
import { initializeSecurity } from "./lib/security";
import "./lib/i18n";

// Initialize security measures
initializeSecurity();

createRoot(document.getElementById("root")!).render(<App />);
