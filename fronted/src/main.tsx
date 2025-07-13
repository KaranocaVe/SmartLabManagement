// src/main.tsx
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // 确保全局样式被引入

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
);