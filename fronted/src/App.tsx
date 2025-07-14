import React from "react";

// 导入 MUI 的主题提供者和样式重置组件
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// 导入 Notistack 的提供者，用于显示全局通知/提示（如登录成功、操作失败等）
import { SnackbarProvider } from "notistack";

// 导入 React Router 的路由提供者
import { RouterProvider } from "react-router-dom";

// 导入我们自定义的主题和路由配置
import theme from "./styles/theme";
import router from "./router";

/**
 * 应用的根组件
 * @description 这个组件负责集成并提供整个应用所需的上下文（Context），
 * 包括UI主题、通知系统和路由。
 */
function App() {
  return (
    // React.StrictMode 用于在开发模式下检查潜在问题
    <React.StrictMode>
      {/* ThemeProvider: 将我们自定义的MUI主题应用到整个组件树 */}
      <ThemeProvider theme={theme}>
        {/* CssBaseline: 一个MUI组件，用于重置和标准化CSS，确保跨浏览器表现一致 */}
        <CssBaseline />

        {/* SnackbarProvider: 为整个应用提供一个便捷的全局通知系统 */}
        <SnackbarProvider
          maxSnack={3} // 屏幕上最多同时显示3条通知
          anchorOrigin={{
            vertical: "bottom", // 垂直方向显示在底部
            horizontal: "right", // 水平方向显示在右侧
          }}
        >
          {/* RouterProvider: 启用我们配置的路由系统 */}
          <RouterProvider router={router} />
        </SnackbarProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
