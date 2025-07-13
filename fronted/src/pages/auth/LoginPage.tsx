import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// MUI 组件
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    TextField,
    Typography,
} from '@mui/material';

// API 和状态管理
import { authApi } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { ROUTES } from '../../router/paths';

// 从生成的API客户端导入请求体类型
import type { LoginRequestDTO } from '../../client';

/**
 * 登录页面组件 (修正版)
 */
const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { login: loginAction } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequestDTO>();

    /**
     * 表单提交处理函数 (已修正)
     */
    const onSubmit: SubmitHandler<LoginRequestDTO> = async (data) => {
        setIsLoading(true);
        try {
            const response = await authApi.login(data);

            if (response.data.code === 200 && response.data.data?.accessToken) {
                // --- 核心修正点 ---
                // 1. 正确地从 response.data.data 中解构出 accessToken
                const { accessToken } = response.data.data;

                // 2. 调用 loginAction，传入获取到的 accessToken。
                //    由于登录接口不返回用户信息，我们暂时传入 null。
                //    后续可以在Dashboard页面加载时，再通过一个 /api/me 之类的接口获取用户信息。
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
        <Card sx={{ minWidth: 275, boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center" fontWeight="bold">
                    智能实验室管理平台
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" mb={3}>
                    请输入您的凭据以继续
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        {...register('username', { required: '用户名为必填项' })}
                        label="用户名"
                        margin="normal"
                        required
                        error={!!errors.username}
                        helperText={errors.username?.message}
                        disabled={isLoading}
                    />
                    <TextField
                        {...register('password', { required: '密码为必填项' })}
                        label="密码"
                        type="password"
                        margin="normal"
                        required
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        disabled={isLoading}
                    />
                    <Box sx={{ position: 'relative', mt: 2 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isLoading}
                        >
                            {isLoading ? '正在登录...' : '登 录'}
                        </Button>
                        {isLoading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
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
