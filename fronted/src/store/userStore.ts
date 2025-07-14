import { create } from "zustand";

interface UserState {
  userId: number | null; // 用户 ID
  username: string | null; // 用户名
  realName: string | null; // 真实姓名
  roles: string[]; // 用户角色
  permissions: string[]; // 用户权限
  email: string | null; // 邮箱
  phone: string | null; // 电话
  setUserData: (data: Partial<UserState>) => void; // 设置用户数据
  clearUserData: () => void; // 清除用户数据
}

const useUserStore = create<UserState>((set) => ({
  userId: null,
  username: localStorage.getItem("username") || "defaultUser", // 默认值为 "defaultUser"
  realName: localStorage.getItem("realName") || null,
  roles: JSON.parse(localStorage.getItem("roles") || "[]"),
  permissions: JSON.parse(localStorage.getItem("permissions") || "[]"),
  email: localStorage.getItem("email") || null,
  phone: localStorage.getItem("phone") || null,
  setUserData: (data) => {
    if (data.username) localStorage.setItem("username", data.username);
    if (data.realName) localStorage.setItem("realName", data.realName);
    if (data.roles) localStorage.setItem("roles", JSON.stringify(data.roles));
    if (data.permissions)
      localStorage.setItem("permissions", JSON.stringify(data.permissions));
    if (data.email) localStorage.setItem("email", data.email);
    if (data.phone) localStorage.setItem("phone", data.phone);

    set((state) => ({ ...state, ...data }));
  },
  clearUserData: () => {
    localStorage.removeItem("username");
    localStorage.removeItem("realName");
    localStorage.removeItem("roles");
    localStorage.removeItem("permissions");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");

    set({
      userId: null,
      username: null,
      realName: null,
      roles: [],
      permissions: [],
      email: null,
      phone: null,
    });
  },
}));

export default useUserStore;
