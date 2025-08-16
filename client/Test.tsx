import React from "react";

export default function Test() {
  console.log("Test component loaded!");
  return (
    <div style={{ padding: "20px", background: "lightblue" }}>
      <h1>Test Component Loaded Successfully!</h1>
      <p>If you can see this, React is working.</p>
    </div>
  );
}
