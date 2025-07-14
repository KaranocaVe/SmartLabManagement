import React, { useState, useEffect } from 'react';
import { useParams, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Tabs,
    Tab,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import { useSnackbar } from 'notistack';

// 导入API和相关类型
import { projectApi } from '../../../api';
import type { ProjectVO } from '../../../client';
import { ROUTES } from '../../../router/paths';

// 定义标签页的配置
const TABS_CONFIG = [
    { label: '项目概览', value: 'overview' },
    { label: '任务管理', value: 'tasks' },
    { label: '实验记录', value: 'records' },
    { label: '实验报告', value: 'reports' },
    { label: '风险评估', value: 'assessments' },
];

/**
 * 项目详情页容器组件
 * @description 负责获取项目基本信息，并提供一个标签页框架来展示不同模块。
 */
const ProjectDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();

    // --- State Management ---
    const [project, setProject] = useState<ProjectVO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState('overview');

    // --- Data Fetching ---
    useEffect(() => {
        if (!id) return;
        setIsLoading(true);
        projectApi.getProjectById(Number(id))
            .then(response => {
                if (response.data.code === 200 && response.data.data) {
                    setProject(response.data.data);
                } else {
                    throw new Error(response.data.message || '获取项目详情失败');
                }
            })
            .catch((error: any) => {
                enqueueSnackbar(error.message, { variant: 'error' });
                navigate(ROUTES.PROJECTS.LIST); // 获取失败则返回列表页
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id, enqueueSnackbar, navigate]);

    // --- Tab Synchronization with URL ---
    useEffect(() => {
        // 根据当前URL路径确定活动的标签页
        const pathSegments = location.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        const tabValue = TABS_CONFIG.find(tab => tab.value === lastSegment)?.value;

        // 如果URL的最后一部分是项目ID，则默认为'overview'
        if (lastSegment === id) {
            setCurrentTab('overview');
        } else if (tabValue) {
            setCurrentTab(tabValue);
        }
    }, [location.pathname, id]);

    // --- Event Handlers ---
    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
        // 导航到对应的子路由，例如 /projects/123/tasks
        const basePath = ROUTES.PROJECTS.DETAILS.replace(':id', id!);
        navigate(newValue === 'overview' ? basePath : `${basePath}/${newValue}`);
    };

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (!project) {
        return <Typography>项目未找到。</Typography>;
    }

    return (
        <Container maxWidth={false}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {project.name}
                    </Typography>
                    <Chip label={`负责人: ${project.projectLeadName || 'N/A'}`} size="small" />
                </CardContent>
            </Card>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3, bgcolor: 'background.paper' }}>
                <Tabs value={currentTab} onChange={handleTabChange} aria-label="项目详情标签页">
                    {TABS_CONFIG.map(tab => (
                        <Tab key={tab.value} label={tab.label} value={tab.value} />
                    ))}
                </Tabs>
            </Box>

            <Box sx={{ mt: 3 }}>
                {/* Outlet 将会渲染匹配的子路由组件，即我们接下来要创建的各个Tab页面 */}
                <Outlet context={{ project }} />
            </Box>
        </Container>
    );
};

export default ProjectDetailPage;
