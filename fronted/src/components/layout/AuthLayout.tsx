import React, {type JSX} from 'react';
import { Box, Container, CssBaseline } from '@mui/material';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }: AuthLayoutProps): JSX.Element => {
    return (
        // AuthLayout 的 Box 负责整个认证页面的全屏和背景
        <Box
            sx={{
                width: '100vw', // 确保这个Box铺满整个视口宽度
                minHeight: '100vh', // 确保这个Box铺满整个视口高度
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // 垂直居中
                alignItems: 'center',     // 水平居中
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            }}
        >
            <CssBaseline />
            {/* Container 用于限制内容卡片的最大宽度，使其在任何屏幕尺寸下看起来都协调 */}
            <Container component="main" maxWidth="xs">
                {/* 渲染子组件，即 LoginPage 提供的 Card */}
                {children}
            </Container>
        </Box>
    );
};

export default AuthLayout;