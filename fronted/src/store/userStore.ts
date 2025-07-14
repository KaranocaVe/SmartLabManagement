import { create } from "zustand";
import type { LoginResponseVO } from "../client";

const USER_INFO_KEY = "userInfo";

interface UserState {
  username: string | null;
  userId?: number;
  realName?: string;
  roles?: string[];
  permissions?: string[];
  email?: string;
  phone?: string;
  tokenType?: string;
  accessToken?: string;
  setUsername: (username: string) => void;
  clearUsername: () => void;
  setUserInfo: (info: LoginResponseVO) => void;
  clearUserInfo: () => void;
}

function loadUserInfo(): Partial<UserState> {
  const raw = localStorage.getItem(USER_INFO_KEY);
  if (!raw) return {};
  try {
    const info = JSON.parse(raw);
    // 修正 username 类型，保证为 string|null
    return {
      ...info,
      username: info.username ?? null,
    };
  } catch {
    return {};
  }
}

const useUserStore = create<UserState>((set) => ({
  username: loadUserInfo().username ?? null,
  userId: loadUserInfo().userId,
  realName: loadUserInfo().realName,
  roles: loadUserInfo().roles,
  permissions: loadUserInfo().permissions,
  email: loadUserInfo().email,
  phone: loadUserInfo().phone,
  tokenType: loadUserInfo().tokenType,
  accessToken: loadUserInfo().accessToken,
  setUsername: (username) => {
    localStorage.setItem("username", username);
    // 同步 userInfo 持久化
    const infoRaw = localStorage.getItem(USER_INFO_KEY);
    const info = infoRaw ? JSON.parse(infoRaw) : {};
    info.username = username;
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
    set({ username });
  },
  clearUsername: () => {
    localStorage.removeItem("username");
    // 同步 userInfo 持久化
    const infoRaw = localStorage.getItem(USER_INFO_KEY);
    const info = infoRaw ? JSON.parse(infoRaw) : {};
    info.username = null;
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
    set({ username: null });
  },
  setUserInfo: (info) => {
    localStorage.setItem("username", info.username ?? "");
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
    set({
      username: info.username ?? null,
      userId: info.userId,
      realName: info.realName,
      roles: info.roles,
      permissions: info.permissions,
      email: info.email,
      phone: info.phone,
      tokenType: info.tokenType,
      accessToken: info.accessToken,
    });
  },
  clearUserInfo: () => {
    localStorage.removeItem("username");
    localStorage.removeItem(USER_INFO_KEY);
    set({
      username: null,
      userId: undefined,
      realName: undefined,
      roles: undefined,
      permissions: undefined,
      email: undefined,
      phone: undefined,
      tokenType: undefined,
      accessToken: undefined,
    });
  },
}));

export default useUserStore;
