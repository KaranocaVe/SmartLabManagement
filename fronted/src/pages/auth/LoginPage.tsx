import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
    Box, // 仍然需要Box来组织Card内部的内容
    Button,
    Card,
    CardContent,
    CircularProgress,
    TextField,
    Typography,
    Avatar,
    Divider,
    InputAdornment,
    IconButton,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { authApi } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { ROUTES } from '../../router/paths';
import type { LoginRequestDTO } from '../../client';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { login: loginAction } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequestDTO>();

    const onSubmit: SubmitHandler<LoginRequestDTO> = async (data) => {
        setIsLoading(true);
        try {
            const response = await authApi.login(data);
            if (response.data.code === 200 && response.data.data?.accessToken) {
                const { accessToken } = response.data.data;
                loginAction(accessToken, null);
                enqueueSnackbar('登录成功，欢迎回来！', { variant: 'success' });
                navigate(ROUTES.DASHBOARD, { replace: true });
            } else {
                throw new Error(response.data.message || '登录失败，返回数据格式不正确');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || '用户名或密码错误';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // 移除 LoginPage 外部的 Box 及其相关的全屏和背景样式
        // AuthLayout 会处理整个页面的背景和居中
        <Card
            sx={{
                minWidth: 350,
                maxWidth: 400,
                boxShadow: 6,
                borderRadius: 4,
                p: 2,
                backdropFilter: 'blur(2px)',
            }}
        >
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mb: 1, width: 56, height: 56 }}>
                        <LockOutlinedIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                        智能实验室管理平台
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        请输入您的凭据以继续
                    </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        {...register('username', { required: '用户名为必填项' })}
                        label="用户名"
                        margin="normal"
                        required
                        fullWidth
                        autoFocus
                        error={!!errors.username}
                        helperText={errors.username?.message}
                        disabled={isLoading}
                        variant="outlined"
                    />
                    <TextField
                        {...register('password', { required: '密码为必填项' })}
                        label="密码"
                        type={showPassword ? 'text' : 'password'}
                        margin="normal"
                        required
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        disabled={isLoading}
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="切换密码可见性"
                                        onClick={() => setShowPassword((show) => !show)}
                                        edge="end"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ position: 'relative', mt: 3 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isLoading}
                            sx={{
                                py: 1.5,
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                letterSpacing: 1,
                            }}
                        >
                            {isLoading ? '正在登录...' : '登 录'}
                        </Button>
                        {isLoading && (
                            <CircularProgress
                                size={28}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-14px',
                                    marginLeft: '-14px',
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default LoginPage;