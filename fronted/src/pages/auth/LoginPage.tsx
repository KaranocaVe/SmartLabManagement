import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useUserStore from "../../store/userStore";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { authApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { ROUTES } from "../../router/paths";
import type { LoginRequestDTO } from "../../client";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { login: loginAction } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // 注册弹窗相关状态
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    email: "",
  });
  const [registerErrors, setRegisterErrors] = useState<{ [key: string]: string }>(
    {}
  );

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
        const loginInfo = response.data.data;
        useUserStore.getState().setUserInfo({
          userId: loginInfo.userId,
          username: loginInfo.username,
          realName: loginInfo.realName,
          roles: loginInfo.roles,
          permissions: loginInfo.permissions,
          email: loginInfo.email,
          phone: loginInfo.phone,
          tokenType: loginInfo.tokenType,
          accessToken: loginInfo.accessToken,
        });
        loginAction(loginInfo.accessToken ?? "", null);
        enqueueSnackbar("登录成功，欢迎回来！", { variant: "success" });
        navigate(ROUTES.DASHBOARD, { replace: true });
      } else {
        throw new Error(
          response.data.message || "登录失败，返回数据格式不正确"
        );
      }
    } catch (error: unknown) {
      // 明确类型，避免 any
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        err.response?.data?.message || err.message || "用户名或密码错误";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // 注册表单输入变更
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  // 注册表单提交
  const handleRegisterSubmit = () => {
    const errors: { [key: string]: string } = {};
    if (!registerForm.username) errors.username = "用户名为必填项";
    if (!registerForm.password) errors.password = "密码为必填项";
    if (!registerForm.confirmPassword) errors.confirmPassword = "请确认密码";
    if (registerForm.password !== registerForm.confirmPassword)
      errors.confirmPassword = "两次密码不一致";
    if (!registerForm.phone) errors.phone = "手机号为必填项";
    if (!registerForm.email) errors.email = "邮箱为必填项";
    setRegisterErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setRegisterLoading(true);
    setTimeout(() => {
      setRegisterLoading(false);
      setRegisterOpen(false);
      enqueueSnackbar("注册成功（仅前端演示，无后端交互）", { variant: "success" });
      setRegisterForm({
        username: "",
        password: "",
        confirmPassword: "",
        phone: "",
        email: "",
      });
      setRegisterErrors({});
    }, 1200);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          minWidth: 350,
          maxWidth: 400,
          boxShadow: 8,
          borderRadius: 5,
          p: 2,
          backdropFilter: "blur(8px)",
          background: "rgba(255,255,255,0.8)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar
              sx={{ bgcolor: "primary.main", mb: 1, width: 56, height: 56 }}
            >
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography
              variant="h5"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              智能实验室管理平台
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              请输入您的凭据以继续
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              {...register("username", { required: "用户名为必填项" })}
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
              {...register("password", { required: "密码为必填项" })}
              label="密码"
              type={showPassword ? "text" : "password"}
              margin="normal"
              required
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
              variant="outlined"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {/*<IconButton*/}
                      {/*  aria-label="切换密码可见性"*/}
                      {/*  onClick={() => setShowPassword((show) => !show)}*/}
                      {/*  edge="end"*/}
                      {/*  disabled={isLoading}*/}
                      {/*>*/}
                      {/*  {showPassword ? <VisibilityOff /> : <Visibility />}*/}
                      {/*</IconButton>*/}
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box sx={{ position: "relative", mt: 3 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  letterSpacing: 1,
                }}
              >
                {isLoading ? "正在登录..." : "登 录"}
              </Button>
              {isLoading && (
                <CircularProgress
                  size={28}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-14px",
                    marginLeft: "-14px",
                  }}
                />
              )}
            </Box>
          </Box>
          {/* 注册入口 */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              没有账号？
              <Button
                variant="text"
                size="small"
                sx={{ ml: 1, textTransform: "none", fontWeight: 500 }}
                onClick={() => setRegisterOpen(true)}
              >
                注册
              </Button>
            </Typography>
          </Box>
          <Divider sx={{ mt: 4, mb: 2 }} />
          {/* 页脚版权和版本信息放在卡片内容内部 */}
          <Box
            sx={{
              textAlign: "center",
              fontSize: "0.85rem",
              color: "text.secondary",
              py: 1,
              borderRadius: "0 0 16px 16px",
            }}
          >
            SmartLabManagement v3.0.0<br />
            © 2025 KaranocaVe<br />
            保留所有权利
          </Box>
        </CardContent>
      </Card>
      {/* 注册弹窗 */}
      <Dialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            boxShadow: 8,
            p: 2,
          }
        }}
      >
        <DialogTitle sx={{
          fontWeight: 'bold',
          fontSize: '1.3rem',
          textAlign: 'center',
          letterSpacing: 2,
          color: 'primary.main',
          pb: 1,
        }}>注册新账号</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField
              label="用户名"
              name="username"
              fullWidth
              margin="dense"
              value={registerForm.username}
              onChange={handleRegisterChange}
              error={!!registerErrors.username}
              helperText={registerErrors.username}
              disabled={registerLoading}
              sx={{
                background: 'rgba(245,247,250,0.7)',
                borderRadius: 2,
                boxShadow: 1,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              label="密码"
              name="password"
              type="password"
              fullWidth
              margin="dense"
              value={registerForm.password}
              onChange={handleRegisterChange}
              error={!!registerErrors.password}
              helperText={registerErrors.password}
              disabled={registerLoading}
              sx={{
                background: 'rgba(245,247,250,0.7)',
                borderRadius: 2,
                boxShadow: 1,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              label="确认密码"
              name="confirmPassword"
              type="password"
              fullWidth
              margin="dense"
              value={registerForm.confirmPassword}
              onChange={handleRegisterChange}
              error={!!registerErrors.confirmPassword}
              helperText={registerErrors.confirmPassword}
              disabled={registerLoading}
              sx={{
                background: 'rgba(245,247,250,0.7)',
                borderRadius: 2,
                boxShadow: 1,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              label="手机号"
              name="phone"
              fullWidth
              margin="dense"
              value={registerForm.phone}
              onChange={handleRegisterChange}
              error={!!registerErrors.phone}
              helperText={registerErrors.phone}
              disabled={registerLoading}
              sx={{
                background: 'rgba(245,247,250,0.7)',
                borderRadius: 2,
                boxShadow: 1,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              label="邮箱"
              name="email"
              fullWidth
              margin="dense"
              value={registerForm.email}
              onChange={handleRegisterChange}
              error={!!registerErrors.email}
              helperText={registerErrors.email}
              disabled={registerLoading}
              sx={{
                background: 'rgba(245,247,250,0.7)',
                borderRadius: 2,
                boxShadow: 1,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Box>
          {/* <Typography variant="caption" color="text.secondary" sx={{ mt: 2, textAlign: 'center', display: 'block' }}>
            * 所有信息仅前端演示，不会保存到服务器
          </Typography> */}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setRegisterOpen(false)} disabled={registerLoading} sx={{ borderRadius: 2, px: 3 }}>
            取消
          </Button>
          <Button
            onClick={handleRegisterSubmit}
            variant="contained"
            disabled={registerLoading}
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: 'bold',
              boxShadow: 2,
              transition: 'background 0.2s, transform 0.2s',
              '&:hover': {
                background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                transform: 'scale(1.04)',
              },
            }}
          >
            {registerLoading ? "注册中..." : "注册"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoginPage;
