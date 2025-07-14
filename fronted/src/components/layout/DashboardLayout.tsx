import React, { useMemo, useState } from "react";
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
  Tooltip,
  Typography,
  Divider,
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
import { useAuthStore } from "../../store/authStore";
// 导入路由常量
import Avatar from "@mui/material/Avatar"; // 引入 Avatar 组件
import { ROUTES } from "../../router/paths";
import LogoutIcon from "@mui/icons-material/Logout";
import useUserStore from "../../store/userStore"; // 引入 userStore
import { useEffect } from "react";
// 定义侧边栏的固定宽度
const drawerWidth = 240;

// 定义导航菜单的配置
const navConfig = [
  { text: "仪表盘", path: ROUTES.DASHBOARD, icon: <DashboardIcon /> },
  { text: "项目管理", path: ROUTES.PROJECTS.LIST, icon: <AccountTreeIcon /> },
  { isDivider: true },
  { text: "设备管理", path: ROUTES.RESOURCES.EQUIPMENT, icon: <ScienceIcon /> },
  {
    text: "物资管理",
    path: ROUTES.RESOURCES.MATERIALS,
    icon: <StorefrontIcon />,
  },
  {
    text: "资源申请",
    path: ROUTES.RESOURCES.REQUESTS,
    icon: <AssignmentIcon />,
  },
  { isDivider: true },
  { text: "用户管理", path: ROUTES.MANAGEMENT.USERS, icon: <PeopleIcon /> },
  { text: "角色管理", path: ROUTES.MANAGEMENT.ROLES, icon: <VpnKeyIcon /> },
  { text: "实验室管理", path: ROUTES.MANAGEMENT.LABS, icon: <BusinessIcon /> },
  {
    text: "供应商管理",
    path: ROUTES.MANAGEMENT.SUPPLIERS,
    icon: <StorefrontIcon />,
  },
  { isDivider: true },
  { text: "安全事件", path: ROUTES.SAFETY.INCIDENTS, icon: <GppGoodIcon /> },
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
      useUserStore.getState().clearUserData(); // 清除用户数据

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
  const { username, realName, roles, permissions, email, phone } =
    useUserStore.getState();

  const userInfoTooltip = useMemo(() => {
    return (
      <Box>
        <Typography variant="body1" fontWeight="bold">
          {realName || "未设置姓名"}
        </Typography>
        <Typography variant="body2">用户名: {username || "未登录"}</Typography>
        <Typography variant="body2">邮箱: {email || "未设置邮箱"}</Typography>
        <Typography variant="body2">电话: {phone || "未设置电话"}</Typography>
        <Typography variant="body2">
          职责: {roles.length > 0 ? roles.join(", ") : "无职责"}
        </Typography>
      </Box>
    );
  }, [username, realName, email, phone]);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // 侧边栏的实际内容
  const drawerContent = (
    <div>
      {/* 为了毛玻璃效果，Toolbar 不再需要独立的背景色 */}
      <Toolbar />
      <Box sx={{ overflow: "auto", height: "calc(100vh - 64px)" }}>
        <List>
          {navConfig.map((item, index) =>
            item.isDivider ? (
              <Divider
                key={`divider-${index}`}
                sx={{ my: 1, borderColor: "rgba(0, 0, 0, 0.1)" }}
              /> // 分割线颜色调整为更柔和的深色
            ) : (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path!)}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "rgba(0, 123, 255, 0.7)", // 选中项的半透明背景
                      color: "#FFFFFF", // 选中项文字保持白色，对比鲜明
                      "&:hover": {
                        backgroundColor: "rgba(0, 123, 255, 0.8)", // 选中项悬停颜色
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.05)", // 非选中项悬停颜色，略微变暗
                      color: "#333333", // 悬停时文字颜色
                    },
                    color: "#333333", // 非选中项文字颜色改为深色，确保可见性
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
            )
          )}
        </List>
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
            <Tooltip title={userInfoTooltip} arrow>
              <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                {username ? username.charAt(0).toUpperCase() : "?"}
              </Avatar>
            </Tooltip>
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
