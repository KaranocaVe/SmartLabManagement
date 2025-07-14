// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // 确保这一行在所有其他组件或库样式之前
import App from "./App";
import ErrorBoundary from "./components/common/ErrorBoundaryProps";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
