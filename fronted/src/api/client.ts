import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
    baseURL: '/api',
    timeout: 10000,
});

// --- 请求拦截器 ---
// 功能：在每个请求发送前，自动附加认证Token。
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- 响应拦截器 ---
// 功能：集中处理所有API响应，包括成功和失败的情况。
apiClient.interceptors.response.use(
    (response) => {
        // 对于成功的响应，我们直接将其传递下去。
        // 由OpenAPI生成的代码会处理后续的.data提取。
        return response;
    },
    (error) => {
        // 在这里，我们集中处理所有类型的API错误。
        const customError = {
            message: '发生了一个未知错误，请稍后重试。',
            status: 500,
            data: null,
        };

        if (error.response) {
            // 服务器返回了错误状态码 (非2xx)
            const { status, data } = error.response;
            customError.status = status;
            customError.data = data;

            if (status === 401) {
                // --- 关键：处理认证失败 ---
                customError.message = '认证已过期，请重新登录。';
                // 触发登出逻辑，并强制刷新页面到登录页
                useAuthStore.getState().logout();
                window.location.replace('/login');
            } else if (data && data.message) {
                // 如果后端返回了具体的错误信息，则使用它
                customError.message = data.message;
            } else {
                // 否则，根据常见的HTTP状态码提供通用的错误信息
                switch (status) {
                    case 400:
                        customError.message = '请求参数错误。';
                        break;
                    case 403:
                        customError.message = '您没有权限执行此操作。';
                        break;
                    case 404:
                        customError.message = '请求的资源未找到。';
                        break;
                    case 500:
                        customError.message = '服务器内部错误，请联系管理员。';
                        break;
                    default:
                        customError.message = `发生错误 (状态码: ${status})。`;
                }
            }
        } else if (error.request) {
            // 请求已发出，但没有收到响应（例如网络中断）
            customError.message = '网络连接失败，请检查您的网络设置。';
        }

        // 在控制台打印详细的原始错误，方便开发者调试
        console.error("API Error Intercepted:", error);

        // 将我们包装过的、更友好的错误对象传递给页面的.catch()块
        return Promise.reject(customError);
    }
);

export default apiClient;
