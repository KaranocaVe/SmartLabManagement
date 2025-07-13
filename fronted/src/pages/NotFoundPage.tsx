import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../router/paths';

/**
 * 404 页面未找到组件
 * @description 当用户访问不存在的路径时显示。
 */
const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate(ROUTES.HOME);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                backgroundColor: 'background.default',
            }}
        >
            <Container maxWidth="md">
                <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                        fontSize: '10rem',
                        fontWeight: 'bold',
                        color: 'primary.main',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                    }}
                >
                    404
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    抱歉，我们找不到您要查找的页面。
                </Typography>
                <Typography color="text.secondary">
                    您访问的链接可能已损坏，或者该页面已被删除。
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleGoHome}
                    sx={{ mt: 4, px: 4, py: 1.5 }}
                >
                    返回首页
                </Button>
            </Container>
        </Box>
    );
};

export default NotFoundPage;
