import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// --- 定义组件的Props接口 ---
interface PageHeaderProps {
    title: string;
    buttonText: string;
    onButtonClick: () => void;
}

/**
 * 通用页面头部组件
 * @description 显示页面标题和一个主要的操作按钮（如“新增”）。
 */
const PageHeader: React.FC<PageHeaderProps> = ({
                                                   title,
                                                   buttonText,
                                                   onButtonClick,
                                               }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between', // 两端对齐
                alignItems: 'center',             // 垂直居中
                marginBottom: 3,                  // 与下方内容保持间距
            }}
        >
            {/* 页面标题 */}
            <Typography variant="h5" component="h1" fontWeight="bold">
                {title}
            </Typography>

            {/* 主要操作按钮 */}
            <Button
                variant="contained"
                startIcon={<AddIcon />} // 在按钮文字前添加一个“+”图标
                onClick={onButtonClick}
            >
                {buttonText}
            </Button>
        </Box>
    );
};

export default PageHeader;
