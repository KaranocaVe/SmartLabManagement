import { create } from "zustand";

interface UserState {
  username: string | null; // 存储用户名
  setUsername: (username: string) => void; // 设置用户名
  clearUsername: () => void; // 清除用户名
}

const useUserStore = create<UserState>((set) => ({
  username: localStorage.getItem("username"), // 从 localStorage 初始化用户名
  setUsername: (username) => {
    localStorage.setItem("username", username); // 存储到 localStorage
    set({ username });
  },
  clearUsername: () => {
    localStorage.removeItem("username"); // 从 localStorage 移除
    set({ username: null });
  },
}));

export default useUserStore;
