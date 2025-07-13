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
 * 登录页面组件
 * @description 包含用户登录表单、表单验证、API调用和状态更新逻辑。
 */
const LoginPage: React.FC = () => {
    // --- Hooks ---
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { login: loginAction } = useAuthStore(); // 从Zustand store获取login action

    // --- State ---
    const [isLoading, setIsLoading] = useState(false);

    // --- React Hook Form ---
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequestDTO>();

    // --- Event Handlers ---
    /**
     * 表单提交处理函数
     * @param {LoginRequestDTO} data - 表单数据
     */
    const onSubmit: SubmitHandler<LoginRequestDTO> = async (data) => {
        setIsLoading(true);
        try {
            // 调用登录API
            const response = await authApi.login(data);

            // 检查API响应是否成功并且包含所需数据
            if (response.data.code === 200 && response.data.data) {
                const { token, user } = response.data.data;

                // 调用Zustand action来更新全局状态并持久化
                loginAction(token, user);

                // 显示成功通知
                enqueueSnackbar('登录成功，欢迎回来！', { variant: 'success' });

                // 重定向到仪表盘页面
                navigate(ROUTES.DASHBOARD, { replace: true });
            } else {
                // 处理后端返回的业务错误
                throw new Error(response.data.message || '登录失败');
            }
        } catch (error: any) {
            // 处理网络错误或业务错误
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

                {/* 使用 handleSubmit 来包裹我们的 onSubmit 函数 */}
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        // 使用 register 来注册输入框
                        {...register('username', { required: '用户名为必填项' })}
                        label="用户名"
                        margin="normal"
                        required
                        // 显示验证错误信息
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
                        {/* 加载指示器 */}
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
