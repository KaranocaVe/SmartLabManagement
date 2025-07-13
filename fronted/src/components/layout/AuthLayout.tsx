import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';

// 定义 AuthLayout 组件的 props 类型
interface AuthLayoutProps {
    children: React.ReactNode; // children 是 React 节点，用于渲染被包裹的子组件
}

/**
 * 认证页面的布局组件
 * @param {AuthLayoutProps} props - 组件的 props
 * @returns {JSX.Element}
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        // 使用 Box 作为根容器，并设置其占据整个视口的高度
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // 垂直居中
                alignItems: 'center',     // 水平居中
                backgroundColor: 'background.default', // 使用主题中定义的默认背景色
            }}
        >
            {/* CssBaseline 用于重置浏览器默认样式，使其在各浏览器中表现一致 */}
            <CssBaseline />

            {/* Container 组件用于限制内容的最大宽度，使其在较大屏幕上不会过宽 */}
            <Container component="main" maxWidth="xs">
                {/* 在这里渲染子组件，例如登录表单 */}
                {children}
            </Container>
        </Box>
    );
};

export default AuthLayout;
