import { createBrowserRouter, Navigate } from 'react-router-dom';

// 导入路由路径常量
import { ROUTES } from './paths';

// --- 导入布局和守卫组件 ---
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthLayout from '../components/layout/AuthLayout';
// import ProtectedRoute from './ProtectedRoute'; // 在开发模式下暂时注释掉

// --- 导入所有页面组件 ---
// Auth
import LoginPage from '../pages/auth/LoginPage';
// Dashboard
import DashboardPage from '../pages/dashboard/OverviewPage'; // 使用真实的仪表盘页面
// Management
import SupplierPage from '../pages/management/SupplierPage';
import LabPage from '../pages/management/LabPage';
import UserPage from '../pages/management/UserPage';
import RolePage from '../pages/management/RolePage';
// Resource
import EquipmentPage from '../pages/resource/EquipmentPage';
import MaterialPage from '../pages/resource/MaterialPage';
import RequestPage from '../pages/resource/RequestPage';
// Project
import ProjectListPage from '../pages/project/ProjectListPage';
import ProjectDetailPage from '../pages/project/detail';
// Project Detail Tabs
import OverviewTab from '../pages/project/detail/tabs/OverviewTab';
import TasksTab from '../pages/project/detail/tabs/TasksTab';
import RecordsTab from '../pages/project/detail/tabs/RecordsTab';
import ReportsTab from '../pages/project/detail/tabs/ReportsTab';
import RiskAssessmentsTab from '../pages/project/detail/tabs/RiskAssessmentsTab';
// Safety
import IncidentPage from '../pages/safety/IncidentPage';
// Other
import NotFoundPage from '../pages/NotFoundPage';
import LogPage from "../pages/audit/LogPage.tsx"; // 导入真实的404页面


/**
 * 创建并配置应用的路由 (开发模式)
 * @description 集成了所有已实现的页面和嵌套路由。
 */
const router = createBrowserRouter([
    {
        // --- 认证路由 ---
        path: ROUTES.AUTH.LOGIN,
        element: (
            <AuthLayout>
                <LoginPage />
            </AuthLayout>
        ),
    },
    {
        // --- 主应用路由 (开发模式下直接访问) ---
        path: ROUTES.HOME,
        element: <DashboardLayout />,
        children: [
            { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
            { path: ROUTES.DASHBOARD, element: <DashboardPage /> },

            // --- 资源管理 ---
            { path: ROUTES.RESOURCES.EQUIPMENT, element: <EquipmentPage /> },
            { path: ROUTES.RESOURCES.MATERIALS, element: <MaterialPage /> },
            { path: ROUTES.RESOURCES.REQUESTS, element: <RequestPage /> },

            // --- 系统配置管理 ---
            { path: ROUTES.MANAGEMENT.SUPPLIERS, element: <SupplierPage /> },
            { path: ROUTES.MANAGEMENT.LABS, element: <LabPage /> },
            { path: ROUTES.MANAGEMENT.USERS, element: <UserPage /> },
            { path: ROUTES.MANAGEMENT.ROLES, element: <RolePage /> },

            // --- 项目管理 ---
            { path: ROUTES.PROJECTS.LIST, element: <ProjectListPage /> },
            {
                path: ROUTES.PROJECTS.DETAILS, // 匹配 /projects/:id
                element: <ProjectDetailPage />,
                children: [
                    // 嵌套的标签页路由
                    { index: true, element: <OverviewTab /> }, // 默认显示概览
                    { path: 'tasks', element: <TasksTab /> },
                    { path: 'records', element: <RecordsTab /> },
                    { path: 'reports', element: <ReportsTab /> },
                    { path: 'assessments', element: <RiskAssessmentsTab /> },
                ],
            },

            // --- 安全管理 ---
            { path: ROUTES.SAFETY.INCIDENTS, element: <IncidentPage /> },

            // 添加日志审计页面的路由
            { path: ROUTES.AUDIT.LOGS, element: <LogPage /> },
        ],
    },
    {
        // --- 404 Not Found 路由 ---
        path: '*',
        element: <NotFoundPage />,
    },
]);

export default router;
