import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
// 导入所有需要的图标
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ScienceIcon from '@mui/icons-material/Science';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import BusinessIcon from '@mui/icons-material/Business';
import StorefrontIcon from '@mui/icons-material/Storefront';
import GppGoodIcon from '@mui/icons-material/GppGood';

// 导入路由常量
import { ROUTES } from '../../router/paths';

// 定义侧边栏的固定宽度
const drawerWidth = 240;

// 定义导航菜单的配置
const navConfig = [
    { text: '仪表盘', path: ROUTES.DASHBOARD, icon: <DashboardIcon /> },
    { text: '项目管理', path: ROUTES.PROJECTS.LIST, icon: <AccountTreeIcon /> },
    { isDivider: true },
    { text: '设备管理', path: ROUTES.RESOURCES.EQUIPMENT, icon: <ScienceIcon /> },
    { text: '物资管理', path: ROUTES.RESOURCES.MATERIALS, icon: <StorefrontIcon /> },
    { text: '资源申请', path: ROUTES.RESOURCES.REQUESTS, icon: <AssignmentIcon /> },
    { isDivider: true },
    { text: '用户管理', path: ROUTES.MANAGEMENT.USERS, icon: <PeopleIcon /> },
    { text: '角色管理', path: ROUTES.MANAGEMENT.ROLES, icon: <VpnKeyIcon /> },
    { text: '实验室管理', path: ROUTES.MANAGEMENT.LABS, icon: <BusinessIcon /> },
    { text: '供应商管理', path: ROUTES.MANAGEMENT.SUPPLIERS, icon: <StorefrontIcon /> },
    { isDivider: true },
    { text: '安全事件', path: ROUTES.SAFETY.INCIDENTS, icon: <GppGoodIcon /> },
];

/**
 * 主仪表盘布局组件 (更新版)
 */
const DashboardLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // 侧边栏的实际内容
    const drawerContent = (
        <div>
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {navConfig.map((item, index) => (
                        item.isDivider ? <Divider key={`divider-${index}`} sx={{ my: 1 }} /> : (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    selected={location.pathname === item.path}
                                    onClick={() => navigate(item.path!)}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        )
                    ))}
                </List>
            </Box>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        智能实验室管理平台
                    </Typography>
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
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
