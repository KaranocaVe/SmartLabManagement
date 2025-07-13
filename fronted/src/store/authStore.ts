import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { UserVO } from '../client';

// 定义认证状态的接口
interface AuthState {
    token: string | null;
    user: UserVO | null;
    isLoggedIn: () => boolean;
    // 修正：让user参数变为可选的
    login: (token: string, user: UserVO | null) => void;
    logout: () => void;
    setUser: (user: UserVO) => void; // 新增一个方法，用于后续单独更新用户信息
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // --- State ---
            token: null,
            user: null,

            // --- Getters ---
            isLoggedIn: () => !!get().token,

            // --- Actions ---
            login: (token, user) => {
                set({ token, user });
            },

            logout: () => {
                set({ token: null, user: null });
            },

            setUser: (user) => {
                set({ user });
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
