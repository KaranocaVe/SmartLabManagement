import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { ResponseCode } from "./responseCodes";

const apiClient = axios.create({
  baseURL: "/",
  timeout: 15000, // 增加超时时间
});

// --- 请求拦截器 ---
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      // 移除调试日志，减少控制台噪音
      config.headers["Authorization"] = `Bearer ${token}`;
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
    // 检查响应数据是否符合预期格式
    if (response.data && response.data.code !== undefined) {
      // 直接返回成功响应
      if (response.data.code === 200) {
        return response;
      }

      // 创建统一格式的错误对象
      const errorObj = new Error(response.data.message || "未知错误");
      // @ts-ignore - 添加额外信息
      errorObj.apiError = true;
      // @ts-ignore
      errorObj.status = response.data.code;
      // @ts-ignore
      errorObj.data = response.data;

      return Promise.reject(errorObj);
    }

    return response;
  },
  (error) => {
    // 创建统一的错误对象
    const errorMessage = "发生了一个未知错误，请稍后重试。";
    const apiError = new Error(errorMessage);

    // 添加额外属性
    // @ts-ignore
    apiError.apiError = true;
    // @ts-ignore
    apiError.status = 500;
    // @ts-ignore
    apiError.data = null;

    // 处理有响应的错误
    if (error.response) {
      const { status, data } = error.response;
      // @ts-ignore
      apiError.status = status;
      // @ts-ignore
      apiError.data = data;

      // 优先处理后端自定义 code
      if (data?.code && typeof data.code === "number") {
        switch (data.code) {
          case ResponseCode.UNAUTHENTICATED:
            apiError.message = "用户未认证或认证已过期。";
            useAuthStore.getState().logout();
            window.location.replace("/login");
            break;
          case ResponseCode.UNAUTHORIZED:
            apiError.message = "权限不足，请联系管理员。";
            break;
          case ResponseCode.INVALID_CREDENTIALS:
            apiError.message = "用户名或密码错误，请重新输入。";
            break;
          case ResponseCode.USER_ACCOUNT_LOCKED:
            apiError.message = "用户账户已被锁定，请联系管理员。";
            break;
          case ResponseCode.USER_ACCOUNT_DISABLED:
            apiError.message = "用户账户已被禁用，请联系管理员。";
            break;
          case ResponseCode.USERNAME_ALREADY_EXISTS:
            apiError.message = "用户名已存在，请更换用户名。";
            break;
          case ResponseCode.EMAIL_ALREADY_EXISTS:
            apiError.message = "电子邮箱已存在，请更换邮箱。";
            break;
          case ResponseCode.ROLE_NOT_FOUND:
            apiError.message = "指定的角色不存在，请重新选择。";
            break;
          case ResponseCode.PROJECT_LEAD_NOT_FOUND:
            apiError.message = "指定的项目负责人不存在，请重新选择。";
            break;
          case ResponseCode.INSUFFICIENT_STOCK:
            apiError.message = "物资库存不足，请减少申请数量。";
            break;
          case ResponseCode.VALIDATION_ERROR:
            apiError.message = "参数校验失败，请检查输入。";
            break;
          case ResponseCode.NOT_FOUND:
            apiError.message = "资源未找到，可能已被删除。";
            break;
          case ResponseCode.FAILURE:
            apiError.message = "操作失败，请稍后重试。";
            break;
          default:
            apiError.message =
              data.message || `发生错误 (状态码: ${data.code})。`;
        }
      } else if (status === 401) {
        apiError.message = "认证已过期，请重新登录。";
        useAuthStore.getState().logout();
        window.location.replace("/login");
      } else if (data?.message) {
        apiError.message = data.message;
      } else {
        switch (status) {
          case 403:
            apiError.message = "您没有权限执行此操作。";
            break;
          case 404:
            apiError.message = "请求的资源未找到。";
            break;
          case 500:
            apiError.message = "服务器内部错误，请稍后重试。";
            break;
          default:
            apiError.message = `请求失败 (状态码: ${status})。`;
        }
      }
    } else if (error.request) {
      apiError.message = "网络连接失败，请检查您的网络设置或服务器是否在线。";
      // @ts-ignore
      apiError.status = 0;
    } else {
      apiError.message = error.message || "发送请求时出错。";
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
