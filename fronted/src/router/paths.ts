/**
 * @file 定义应用中所有页面的路由路径常量 (完整版)
 * @description 将所有路由路径集中管理，便于维护和重用，避免在代码中使用硬编码的字符串。
 */

export const ROUTES = {
    // --- 根路径 ---
    HOME: '/',

    // --- 认证模块 ---
    AUTH: {
        LOGIN: '/login',
    },

    // --- 仪表盘 ---
    DASHBOARD: '/dashboard',

    // --- 项目管理 ---
    PROJECTS: {
        LIST: '/projects',
        /**
         * 项目详情页基础路径。
         * 使用 :id 作为动态参数占位符。
         * @example generatePath(ROUTES.PROJECTS.DETAILS, { id: '123' }) => /projects/123
         */
        DETAILS: '/projects/:id',
    },

    // --- 资源管理 ---
    RESOURCES: {
        EQUIPMENT: '/resources/equipment',
        MATERIALS: '/resources/materials',
        REQUESTS: '/resources/requests', // 预留，第七批内容
    },

    // --- 系统配置管理 ---
    MANAGEMENT: {
        USERS: '/management/users',
        ROLES: '/management/roles',
        LABS: '/management/labs',
        SUPPLIERS: '/management/suppliers',
    },

    // --- 安全与合规 ---
    SAFETY: {
        INCIDENTS: '/safety/incidents', // 预留，第七批内容
    },

    // --- 日志审计 ---
    AUDIT: {
        LOGS: '/audit/logs', // 预留，第七批内容
    },

    // --- 404 Not Found ---
    NOT_FOUND: '/404',
};
