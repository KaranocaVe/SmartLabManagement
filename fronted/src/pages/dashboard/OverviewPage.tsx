import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Avatar,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ScienceIcon from '@mui/icons-material/Science';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// 导入API
import { projectApi, resourceRequestApi, materialApi, safetyIncidentApi } from '../../api';

// 定义统计数据的接口
interface Stats {
    activeProjects: number;
    pendingRequests: number;
    lowStockMaterials: number;
    totalIncidents: number;
}

/**
 * 仪表盘页面
 * @description 展示系统的关键指标（KPI）摘要。
 */
const OverviewPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 使用 Promise.all 并发执行所有API请求
                const [
                    projectsRes,
                    requestsRes,
                    materialsRes,
                    incidentsRes
                ] = await Promise.all([
                    projectApi.getProjectPage({ pageNum: 1, pageSize: 1 }),
                    resourceRequestApi.getRequests({ status: 'PENDING', pageNum: 1, pageSize: 1 }),
                    materialApi.getMaterialPage({ pageNum: 1, pageSize: 999 }), // 获取所有物资以在前端计算低库存
                    safetyIncidentApi.getIncidentPage({ pageNum: 1, pageSize: 1 }),
                ]);

                // 计算低库存物资数量
                const lowStockCount = materialsRes.data.data?.records?.filter(
                    m => m.stock <= m.warningStock
                ).length || 0;

                setStats({
                    activeProjects: projectsRes.data.data?.total || 0,
                    pendingRequests: requestsRes.data.data?.total || 0,
                    lowStockMaterials: lowStockCount,
                    totalIncidents: incidentsRes.data.data?.total || 0,
                });

            } catch (error) {
                enqueueSnackbar('加载仪表盘数据失败', { variant: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [enqueueSnackbar]);

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth={false}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                仪表盘
            </Typography>
            <Grid container spacing={3}>
                {/* 活动项目卡片 */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                <AccountTreeIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" component="div">{stats?.activeProjects}</Typography>
                                <Typography color="text.secondary">活动项目</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 待审批申请卡片 */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                <PendingActionsIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" component="div">{stats?.pendingRequests}</Typography>
                                <Typography color="text.secondary">待审批申请</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 低库存物资卡片 */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                                <ScienceIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" component="div">{stats?.lowStockMaterials}</Typography>
                                <Typography color="text.secondary">低库存物资</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 安全事件总数卡片 */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                                <WarningAmberIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" component="div">{stats?.totalIncidents}</Typography>
                                <Typography color="text.secondary">安全事件总数</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default OverviewPage;
