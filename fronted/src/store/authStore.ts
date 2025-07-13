import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 导入由OpenAPI生成的类型。
// 假设您的 `client/api.ts` 中导出了 UserVO 类型。
// 如果没有，可以先使用一个临时类型。
import type { UserVO } from '../client';

// 定义认证状态的接口
interface AuthState {
    token: string | null;
    user: UserVO | null;
    isLoggedIn: () => boolean;
    login: (token: string, user: UserVO) => void;
    logout: () => void;
}

/**
 * 创建一个用于管理认证状态的Zustand store。
 * * @description
 * - 使用 `persist` 中间件将状态自动保存到 `localStorage`，
 * 这样即使用户刷新页面，登录状态也不会丢失。
 * - `name: 'auth-storage'` 是保存在localStorage中的键名。
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // --- State ---
            token: null,
            user: null,

            // --- Getters ---
            /**
             * 一个计算属性，用于方便地检查用户是否已登录。
             * @returns {boolean} 如果token存在则返回true，否则返回false。
             */
            isLoggedIn: () => !!get().token,

            // --- Actions ---
            /**
             * 处理用户登录的action。
             * @param {string} token - 从API获取的认证令牌。
             * @param {UserVO} user - 从API获取的用户信息。
             */
            login: (token, user) => {
                set({ token, user });
            },

            /**
             * 处理用户登出的action。
             * 将token和user信息重置为null。
             */
            logout: () => {
                set({ token: null, user: null });
                // 可以在这里添加其他登出逻辑，例如清除其他缓存
            },
        }),
        {
            name: 'auth-storage', // 在 localStorage 中存储的键名
            storage: createJSONStorage(() => localStorage), // 指定使用 localStorage
        }
    )
);
