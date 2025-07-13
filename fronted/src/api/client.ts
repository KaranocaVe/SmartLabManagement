import axios, { type RawAxiosRequestConfig } from 'axios';
// 导入Zustand store，我们将在第三批中创建它。
// 这里我们先假设它存在，并从它那里获取token和logout方法。
import { useAuthStore } from '../store/authStore';

// 创建一个Axios的实例，并进行基础配置
const apiClient = axios.create({
    // baseURL 将会由 Vite 的代理在开发环境中处理
    // 在生产环境中，它会指向部署的同源API
    baseURL: '/api',
    // 设置请求超时时间为10秒
    timeout: 10000,
});

// --- 请求拦截器 ---
// 在每个请求被发送之前，这个函数都会被调用
apiClient.interceptors.request.use(
    (config) => {
        // 从Zustand store的当前状态中获取token
        const token = useAuthStore.getState().token;

        // 如果token存在，则将其添加到请求的 Authorization 头中
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // 如果在设置请求时发生错误，则直接拒绝Promise
        return Promise.reject(error);
    }
);

// --- 响应拦截器 ---
// 在接收到响应之后，这个函数都会被调用
apiClient.interceptors.response.use(
    (response) => {
        // 对于成功的响应 (状态码在 2xx 范围内), 我们直接返回响应体中的 `data` 部分。
        // 这样业务代码中就不需要再写 response.data。
        // 注意：您生成的API客户端似乎会自己处理.data，
        // 所以我们这里直接返回整个response，让生成器代码处理。
        return response;
    },
    (error) => {
        // 对于失败的响应 (状态码超出 2xx 范围)
        if (error.response) {
            const { status, data } = error.response;

            // 我们特别关注 401 Unauthorized 错误，这通常意味着token无效或已过期
            if (status === 401) {
                // 调用Zustand store中的logout方法，清除本地存储的token和用户信息
                useAuthStore.getState().logout();
                // 使用 window.location.replace 跳转到登录页，这会刷新页面，
                // 比使用React Router的跳转更彻底，能清理掉所有组件状态。
                window.location.replace('/login');
                // 抛出一个错误，中断当前的Promise链
                return Promise.reject(new Error('Unauthorized: Redirecting to login.'));
            }

            // 对于其他错误，可以根据后端返回的错误信息(data.message)进行全局提示。
            // 例如使用 notistack (我们将在后续步骤集成)
            // enqueueSnackbar(data?.message || '服务器发生未知错误', { variant: 'error' });
        } else if (error.request) {
            // 请求已发出，但没有收到响应 (例如网络断开)
            console.error('Network Error:', error.request);
            // enqueueSnackbar('网络连接失败，请检查您的网络', { variant: 'error' });
        } else {
            // 在设置请求时触发了一个错误
            console.error('Request Setup Error:', error.message);
        }

        // 将错误继续向下传递，这样具体的API调用点仍然可以通过 .catch() 来捕获并处理它
        return Promise.reject(error);
    }
);

export default apiClient;
