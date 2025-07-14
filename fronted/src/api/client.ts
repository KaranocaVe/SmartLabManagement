import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { ResponseCode } from './responseCodes';

const apiClient = axios.create({
    baseURL: '/',
    timeout: 10000,
});

// --- 请求拦截器 ---
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;

        // --- 新增的调试日志 ---
        if (token) {
            console.log('[API Interceptor] Token found, attaching to header:', token);
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn('[API Interceptor] No token found for this request.');
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- 响应拦截器 ---
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const customError = {
            message: '发生了一个未知错误，请稍后重试。',
            status: 500,
            data: null,
        };

        if (error.response) {
            const { status, data } = error.response;
            customError.status = status;
            customError.data = data;

            // 优先处理后端自定义 code
            if (data && typeof data.code === 'number') {
                switch (data.code) {
                    case ResponseCode.UNAUTHENTICATED:
                        customError.message = '用户未认证或认证已过期。';
                        useAuthStore.getState().logout();
                        window.location.replace('/login');
                        break;
                    case ResponseCode.UNAUTHORIZED:
                        customError.message = '权限不足。';
                        break;
                    case ResponseCode.INVALID_CREDENTIALS:
                        customError.message = '用户名或密码错误。';
                        break;
                    case ResponseCode.USER_ACCOUNT_LOCKED:
                        customError.message = '用户账户已被锁定。';
                        break;
                    case ResponseCode.USER_ACCOUNT_DISABLED:
                        customError.message = '用户账户已被禁用。';
                        break;
                    case ResponseCode.USERNAME_ALREADY_EXISTS:
                        customError.message = '用户名已存在。';
                        break;
                    case ResponseCode.EMAIL_ALREADY_EXISTS:
                        customError.message = '电子邮箱已存在。';
                        break;
                    case ResponseCode.ROLE_NOT_FOUND:
                        customError.message = '指定的角色不存在。';
                        break;
                    case ResponseCode.PROJECT_LEAD_NOT_FOUND:
                        customError.message = '指定的项目负责人不存在。';
                        break;
                    case ResponseCode.INSUFFICIENT_STOCK:
                        customError.message = '物资库存不足。';
                        break;
                    case ResponseCode.VALIDATION_ERROR:
                        customError.message = '参数校验失败。';
                        break;
                    case ResponseCode.NOT_FOUND:
                        customError.message = '资源未找到。';
                        break;
                    case ResponseCode.FAILURE:
                        customError.message = '操作失败。';
                        break;
                    default:
                        if (data.message) {
                            customError.message = data.message;
                        } else {
                            customError.message = `发生错误 (状态码: ${data.code})。`;
                        }
                }
            } else if (status === 401) {
                customError.message = '认证已过期，请重新登录。';
                useAuthStore.getState().logout();
                window.location.replace('/login');
            } else if (data && data.message) {
                customError.message = data.message;
            } else {
                switch (status) {
                    case 403: customError.message = '您没有权限执行此操作。'; break;
                    case 404: customError.message = '请求的资源未找到。'; break;
                    case 500: customError.message = '服务器内部错误。'; break;
                    default: customError.message = `发生错误 (状态码: ${status})。`;
                }
            }
        } else if (error.request) {
            customError.message = '网络连接失败，请检查您的网络设置。';
        }

        console.error("API Error Intercepted:", error);
        return Promise.reject(customError);
    }
);

export default apiClient;
