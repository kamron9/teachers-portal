import React from "react";

export default function App() {
  console.log("App component rendering");

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f8ff" }}>
      <h1 style={{ color: "#333" }}>🎓 Tutoring Marketplace</h1>
      <p style={{ color: "#666" }}>Application is loading successfully!</p>
      <div style={{ marginTop: "20px" }}>
        <h2>Features:</h2>
        <ul>
          <li>Find qualified teachers</li>
          <li>Book lessons online</li>
          <li>Manage your learning schedule</li>
        </ul>
      </div>
    </div>
  );
}
