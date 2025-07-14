import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Popover,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
// 导入所有需要的图标
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ScienceIcon from "@mui/icons-material/Science";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import BusinessIcon from "@mui/icons-material/Business";
import StorefrontIcon from "@mui/icons-material/Storefront";
import GppGoodIcon from "@mui/icons-material/GppGood";
import HistoryIcon from '@mui/icons-material/History';
import { useAuthStore } from "../../store/authStore";
// 导入路由常量
import Avatar from "@mui/material/Avatar"; // 引入 Avatar 组件
import { ROUTES } from "../../router/paths";
import LogoutIcon from "@mui/icons-material/Logout";
import useUserStore from "../../store/userStore"; // 引入 userStore
// 定义侧边栏的固定宽度
const drawerWidth = 240;

// 定义导航菜单的配置，并为每个条目增加 requiredPermission 字段
const navConfig = [
  { text: "仪表盘", path: ROUTES.DASHBOARD, icon: <DashboardIcon />, requiredPermission: null },
  { text: "项目管理", path: ROUTES.PROJECTS.LIST, icon: <AccountTreeIcon />, requiredPermission: "project:view:all" },
  { isDivider: true },
  { text: "设备管理", path: ROUTES.RESOURCES.EQUIPMENT, icon: <ScienceIcon />, requiredPermission: "equipment:manage" },
  {
    text: "物资管理",
    path: ROUTES.RESOURCES.MATERIALS,
    icon: <StorefrontIcon />,
    requiredPermission: "material:manage"
  },
  {
    text: "资源申请",
    path: ROUTES.RESOURCES.REQUESTS,
    icon: <AssignmentIcon />,
    requiredPermission: "resource:request"
  },
  { isDivider: true },
  { text: "用户管理", path: ROUTES.MANAGEMENT.USERS, icon: <PeopleIcon />, requiredPermission: "user:view" },
  { text: "角色管理", path: ROUTES.MANAGEMENT.ROLES, icon: <VpnKeyIcon />, requiredPermission: "role:manage" },
  { text: "实验室管理", path: ROUTES.MANAGEMENT.LABS, icon: <BusinessIcon />, requiredPermission: "lab:manage" },
  {
    text: "供应商管理",
    path: ROUTES.MANAGEMENT.SUPPLIERS,
    icon: <StorefrontIcon />,
    requiredPermission: "supplier:manage"
  },
  { isDivider: true },
  { text: "安全事件", path: ROUTES.SAFETY.INCIDENTS, icon: <GppGoodIcon />, requiredPermission: "safety:log_incident" },
  { text: "日志审计", path: ROUTES.AUDIT.LOGS, icon: <HistoryIcon />, requiredPermission: null }, // 日志审计所有人可见
];

/**
 * 登出按钮组件
 * 负责处理用户登出逻辑
 */
function LogOutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      useAuthStore.getState().logout(); // 调用 store 中的登出方法
      useUserStore.getState().clearUsername(); // 清除用户名

      // 重定向到登录页面
      navigate("/login");
      console.log("用户已登出");
    } catch (error) {
      console.error("登出失败", error);
    }
  };
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleLogout}
      sx={{
        padding: "6px 12px",
        fontSize: "0.875rem",
        minWidth: "auto",
        borderRadius: "8px",
        textTransform: "none",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
          backgroundColor: "rgba(0, 123, 255, 0.8)", // 登出按钮悬停效果，略微变暗
        },
        backgroundColor: "rgba(0, 123, 255, 0.9)", // 登出按钮的半透明背景
        color: "#FFFFFF", // 保持白色，因为按钮背景是鲜明的蓝色
      }}
    >
      登出
      <LogoutIcon sx={{ ml: 0.5, fontSize: "1rem" }} />
    </Button>
  );
}
/**
 * 主仪表盘布局组件 (更新版)
 */
const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useUserStore(); // 获取所有用户信息
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleAvatarMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAvatarMouseLeave = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // 侧边栏的实际内容
  const drawerContent = (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      {/* 为了毛玻璃效果，Toolbar 不再需要独立的背景色 */}
      <Toolbar />
      <Box sx={{ overflow: "auto", height: "calc(100vh - 64px - 80px)" }}>
        <List>
          {navConfig.map((item, index) => {
            // 分割线直接显示
            if (item.isDivider) {
              return (
                <Divider
                  key={`divider-${index}`}
                  sx={{ my: 1, borderColor: "rgba(0, 0, 0, 0.1)" }}
                />
              );
            }
            // 权限校验：无 requiredPermission 或用户拥有该权限才显示
            if (!item.requiredPermission || (userInfo.permissions && userInfo.permissions.includes(item.requiredPermission))) {
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => navigate(item.path!)}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "rgba(0, 123, 255, 0.7)",
                        color: "#FFFFFF",
                        "&:hover": {
                          backgroundColor: "rgba(0, 123, 255, 0.8)",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        color: "#333333",
                      },
                      color: "#333333",
                      paddingY: "12px",
                      paddingX: "24px",
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} sx={{ fontWeight: 500 }} />
                  </ListItemButton>
                </ListItem>
              );
            }
            // 没有权限则不显示
            return null;
          })}
        </List>
      </Box>
      {/* 侧边栏底部 foot 区域 */}
      <Box sx={{
        mt: 'auto',
        py: 2,
        px: 2,
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'text.secondary',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(4px)',
      }}>
        SmartLabManagement v3.0.0<br />
        © 2025 KaranocaVe<br />
        保留所有权利
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* 为了更好地展示毛玻璃效果，可以给整个页面一个背景，或者在主内容区放置一个带背景的元素 */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage:
            'url("https://source.unsplash.com/random/1920x1080?abstract,tech,city")', // 示例背景图，换了一张，可能会有不同效果
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1, // 确保背景在最底层
        }}
      />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "rgba(255, 255, 255, 0.7)", // 半透明白色背景
          backdropFilter: "blur(10px) saturate(180%)", // 毛玻璃效果
          WebkitBackdropFilter: "blur(10px) saturate(180%)", // 兼容 Safari
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // 轻微阴影
          color: "#333333", // AppBar 的文字颜色改为深色
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)", // 底部增加细边框
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit" // 继承父级颜色，即 #333333
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 600 }}
            >
              智能实验室管理平台
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              onMouseEnter={handleAvatarMouseEnter}
              onMouseLeave={handleAvatarMouseLeave}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                {userInfo.username ? userInfo.username.charAt(0).toUpperCase() : "?"}
              </Avatar>
                <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleAvatarMouseLeave}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                sx={{ pointerEvents: "none" }}
                PaperProps={{
                  sx: {
                  pointerEvents: "auto",
                  p: 2,
                  minWidth: 260,
                  borderRadius: 2,
                  boxShadow: 4,
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(6px)",
                  },
                }}
                disableRestoreFocus
                >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40, mr: 2 }}>
                  {userInfo.username ? userInfo.username.charAt(0).toUpperCase() : "?"}
                  </Avatar>
                  <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {userInfo.realName ?? userInfo.username ?? "-"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userInfo.email ?? "-"}
                  </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <List dense sx={{ p: 0 }}>
                  <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={<span style={{ fontWeight: 500 }}>用户名</span>}
                    secondary={userInfo.username ?? "-"}
                  />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={<span style={{ fontWeight: 500 }}>真实姓名</span>}
                    secondary={userInfo.realName ?? "-"}
                  />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={<span style={{ fontWeight: 500 }}>用户ID</span>}
                    secondary={userInfo.userId ?? "-"}
                  />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={<span style={{ fontWeight: 500 }}>手机号</span>}
                    secondary={userInfo.phone ?? "-"}
                  />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={<span style={{ fontWeight: 500 }}>角色</span>}
                    secondary={userInfo.roles?.join(", ") ?? "-"}
                  />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={<span style={{ fontWeight: 500 }}>权限</span>}
                    secondary={
                    userInfo.permissions && userInfo.permissions.length > 0
                      ? (
                      <Box component="span" sx={{ whiteSpace: "pre-line", wordBreak: "break-all", fontSize: "0.85rem", color: "text.secondary" }}>
                        {userInfo.permissions.join("\n")}
                      </Box>
                      )
                      : "-"
                    }
                  />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={<span style={{ fontWeight: 500 }}>Token类型</span>}
                    secondary={userInfo.tokenType ?? "-"}
                  />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={<span style={{ fontWeight: 500 }}>AccessToken</span>}
                    secondary={userInfo.accessToken ? userInfo.accessToken.slice(0, 8) + "..." : "-"}
                  />
                  </ListItem>
                </List>
                </Popover>
              <Typography variant="body1" noWrap sx={{ color: "inherit", ml: 1 }}>
                {userInfo.username ? `欢迎, ${userInfo.username}` : "未登录"}
              </Typography>
            </Box>
            <LogOutButton />
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="main navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "rgba(255, 255, 255, 0.7)", // 临时抽屉的半透明白色背景
              backdropFilter: "blur(10px) saturate(180%)", // 毛玻璃效果
              WebkitBackdropFilter: "blur(10px) saturate(180%)",
              borderRight: "1px solid rgba(0, 0, 0, 0.1)", // 右侧增加细边框
              color: "#333333", // 临时抽屉的文字颜色改为深色
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "rgba(255, 255, 255, 0.7)", // 永久抽屉的半透明白色背景
              backdropFilter: "blur(10px) saturate(180%)", // 毛玻璃效果
              WebkitBackdropFilter: "blur(10px) saturate(180%)",
              boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.1)", // 轻微阴影
              borderRight: "1px solid rgba(0, 0, 0, 0.1)", // 右侧增加细边框
              color: "#333333", // 永久抽屉的文字颜色改为深色
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "transparent", // 主内容区域透明，以便看到背景图
          minHeight: "100vh",
          color: "#333333", // 主内容区文字颜色，根据背景图调整
        }}
      >
        {/* 为了内容不被顶部AppBar覆盖，需要Toolbar作为占位符 */}
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
