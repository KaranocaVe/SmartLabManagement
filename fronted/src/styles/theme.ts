import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// 创建一个全局主题实例，用于整个应用
const theme = createTheme({
    // 调色板，定义了应用的主要颜色
    palette: {
        primary: {
            main: '#1976d2', // 主色调：专业的蓝色，适合管理后台
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#9c27b0', // 辅助色：紫色，用于次要操作或高亮
        },
        error: {
            main: red.A400, // 错误色：使用MUI预设的红色
        },
        background: {
            default: '#f4f6f8', // 全局页面背景色：非常浅的灰色，比纯白更柔和
            paper: '#ffffff',   // 卡片、对话框等“纸张”元素的背景色
        },
    },
    //  typography: 字体排印系统
    typography: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        h5: {
            fontWeight: 700, // 标题5的字重，使其更突出
            fontSize: '1.5rem',
        },
        body1: {
            fontSize: '1rem', // 正文字体大小
        }
    },
    // components: 在这里可以为特定组件设置全局默认样式或属性
    components: {
        // --- 按钮全局样式 ---
        MuiButton: {
            defaultProps: {
                disableElevation: true, // 默认禁用按钮的阴影，使其更扁平
            },
            styleOverrides: {
                root: {
                    textTransform: 'none', // 按钮内的文字不自动大写
                    borderRadius: 8,       // 统一的按钮圆角
                    padding: '10px 20px',  // 统一的按钮内边距
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#1565c0', // 主按钮悬停时的颜色
                    },
                },
            },
        },
        // --- 卡片全局样式 ---
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // 统一的卡片圆角
                    // 一个更精致、更柔和的阴影
                    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
                }
            }
        },
        // --- 输入框全局样式 ---
        MuiTextField: {
            defaultProps: {
                variant: 'outlined', // 默认使用带边框的输入框样式
                fullWidth: true,
            }
        },
        // --- 数据表格全局样式 ---
        // MuiDataGrid 不能通过 createTheme 全局覆盖，请在使用 DataGrid 时通过 sx 或 styled 局部设置样式
    },
});

export default theme;
