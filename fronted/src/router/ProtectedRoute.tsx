import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// 导入我们的全局认证状态管理器和路由常量
import { useAuthStore } from '../store/authStore';
import { ROUTES } from './paths';

/**
 * 路由守卫（保护路由）组件
 * @description
 * - 检查用户是否已登录（通过检查Zustand store中是否存在token）。
 * - 如果用户未登录，则自动重定向到登录页面。
 * - 如果用户已登录，则使用 <Outlet /> 组件来渲染其被包裹的子路由。
 */
const ProtectedRoute: React.FC = () => {
    // 从Zustand store中获取token。
    // 使用selector `(state) => state.token` 可以进行性能优化，
    // 只有当token的值发生变化时，这个组件才会重新渲染。
    const token = useAuthStore((state) => state.token);

    // 检查token是否存在
    if (!token) {
        // 如果token不存在，则用户未登录。
        // 使用Navigate组件将用户重定向到登录页。
        // `replace: true` 属性可以防止用户通过浏览器的“后退”按钮回到这个被保护的页面。
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    }

    // 如果token存在，说明用户已登录。
    // <Outlet /> 是React Router v6的一个关键组件，它会在此处渲染当前匹配的子路由。
    // 在我们的例子中，它将渲染 DashboardLayout 以及其下的所有页面。
    return <Outlet />;
};

export default ProtectedRoute;
