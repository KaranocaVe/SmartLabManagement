import { create } from "zustand";

interface UserState {
  username: string | null; // 存储用户名
  setUsername: (username: string) => void; // 设置用户名
  clearUsername: () => void; // 清除用户名
}

const useUserStore = create<UserState>((set) => ({
  username: null, // 初始值为 null
  setUsername: (username) => set({ username }), // 设置用户名
  clearUsername: () => set({ username: null }), // 清除用户名
}));

export default useUserStore;
