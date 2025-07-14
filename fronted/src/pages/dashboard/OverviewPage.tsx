import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  CardActions,
  Button,
  ListItemButton,
  Fade,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

// 导入图标
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ScienceIcon from "@mui/icons-material/Science";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BlockIcon from '@mui/icons-material/Block';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BusinessIcon from '@mui/icons-material/Business';

// 导入API和相关类型
import {
  projectApi,
  resourceRequestApi,
  materialApi,
  safetyIncidentApi,
  userApi,
  supplierApi,
  labApi,
} from "../../api";
import type { IPageProjectVO, IPageResourceRequestVO, IPageMaterial, IPageSafetyIncidentVO, IPageUserVO, IPageSupplier, IPageLab } from "../../client/api";
import type { ProjectVO, ResourceRequestVO, Material } from "../../client/api";
import { ROUTES } from "../../router/paths";


// 定义统计数据的接口
interface Stats {
  activeProjects?: number;
  pendingRequests?: number;
  lowStockMaterials?: number;
  totalIncidents?: number;
  userCount?: number;
  supplierCount?: number;
  labCount?: number;
}

// 通用信息卡片组件
function GridCard({
  icon,
  bgColor,
  title,
  status,
}: {
  icon: React.ReactNode;
  bgColor: string;
  title: string;
  status: number | undefined;
}) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Fade in timeout={600}>
        <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 4, transition: "box-shadow 0.3s", '&:hover': { boxShadow: 8 } }}>
          <CardContent sx={{ display: "flex", alignItems: "center", py: 3 }}>
            {status !== undefined ? (
              <>
                <Avatar sx={{ bgcolor: bgColor, mr: 2, width: 56, height: 56, fontSize: 32 }}>{icon}</Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {status}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 16 }}>{title}</Typography>
                </Box>
              </>
            ) : (
              <>
                <Avatar sx={{ bgcolor: "grey.400", mr: 2, width: 56, height: 56 }}><BlockIcon /></Avatar>
                <Box>
                  <Typography variant="h6" component="div">无权限</Typography>
                  <Typography color="text.secondary">{title}</Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Fade>
    </Grid>
  );
}

/**
 * 仪表盘页面 (布局优化版)
 * @description 展示系统的关键指标摘要，并提供最近项目和待办事项的快速概览。
 */
const OverviewPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({});
  const [recentProjects, setRecentProjects] = useState<ProjectVO[]>([]);
  const [pendingRequestsList, setPendingRequestsList] = useState<ResourceRequestVO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const requestsToRun = [
          projectApi.getProjectPage({ pageNum: 1, pageSize: 1 }).catch(() => ({ data: { data: {} as IPageProjectVO } })),
          resourceRequestApi.getRequests({ status: "PENDING", pageNum: 1, pageSize: 1 }).catch(() => ({ data: { data: {} as IPageResourceRequestVO } })),
          materialApi.getMaterialPage({ pageNum: 1, pageSize: 999 }).catch(() => ({ data: { data: {} as IPageMaterial } })),
          safetyIncidentApi.getIncidentPage({ pageNum: 1, pageSize: 1 }).catch(() => ({ data: { data: {} as IPageSafetyIncidentVO } })),
          projectApi.getProjectPage({ pageNum: 1, pageSize: 5 }).catch(() => ({ data: { data: {} as IPageProjectVO } })),
          resourceRequestApi.getRequests({ status: "PENDING", pageNum: 1, pageSize: 5 }).catch(() => ({ data: { data: {} as IPageResourceRequestVO } })),
          userApi.getUserPage({ pageNum: 1, pageSize: 1 }).catch(() => ({ data: { data: {} as IPageUserVO } })),
          supplierApi.getSupplierPage({ pageNum: 1, pageSize: 1 }).catch(() => ({ data: { data: {} as IPageSupplier } })),
          labApi.getLabPage({ pageNum: 1, pageSize: 1 }).catch(() => ({ data: { data: {} as IPageLab } })),
        ];
        const [
          projectsRes,
          requestsRes,
          materialsRes,
          incidentsRes,
          recentProjectsRes,
          pendingRequestsListRes,
          userRes,
          supplierRes,
          labRes,
        ] = await Promise.all(requestsToRun);
        const lowStockCount = Array.isArray(materialsRes.data.data?.records)
          ? (materialsRes.data.data.records as Material[]).filter(
              (m) => (m.currentStock ?? 0) <= (m.lowStockThreshold ?? 0)
            ).length
          : 0;
        setStats({
          activeProjects: typeof projectsRes.data.data?.total === "number" ? projectsRes.data.data.total : undefined,
          pendingRequests: typeof requestsRes.data.data?.total === "number" ? requestsRes.data.data.total : undefined,
          lowStockMaterials: lowStockCount,
          totalIncidents: typeof incidentsRes.data.data?.total === "number" ? incidentsRes.data.data.total : undefined,
          userCount: typeof userRes.data.data?.total === "number" ? userRes.data.data.total : undefined,
          supplierCount: typeof supplierRes.data.data?.total === "number" ? supplierRes.data.data.total : undefined,
          labCount: typeof labRes.data.data?.total === "number" ? labRes.data.data.total : undefined,
        });
        setRecentProjects(Array.isArray(recentProjectsRes.data.data?.records) ? recentProjectsRes.data.data.records : []);
        setPendingRequestsList(Array.isArray(pendingRequestsListRes.data.data?.records) ? pendingRequestsListRes.data.data.records : []);
      } catch (error) {
        console.error("加载仪表盘数据时发生未知错误:", error);
        enqueueSnackbar("加载仪表盘数据失败", { variant: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [enqueueSnackbar]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', letterSpacing: 1 }}>
        仪表盘
      </Typography>
      {/* KPI 卡片区域 */}
      <Grid container spacing={3}>
        {/* 采用渐变背景和阴影美化 */}
        <GridCard bgColor="primary.main" title="活动项目" status={stats.activeProjects} icon={<AccountTreeIcon />} />
        <GridCard bgColor="warning.main" title="待审批申请" status={stats.pendingRequests} icon={<PendingActionsIcon />} />
        <GridCard bgColor="info.main" title="低库存物资" status={stats.lowStockMaterials} icon={<ScienceIcon />} />
        <GridCard bgColor="error.main" title="安全事件总数" status={stats.totalIncidents} icon={<WarningAmberIcon />} />
        <GridCard bgColor="success.main" title="系统用户数" status={stats.userCount} icon={<PeopleIcon />} />
        <GridCard bgColor="secondary.main" title="供应商总数" status={stats.supplierCount} icon={<StorefrontIcon />} />
        <GridCard bgColor="primary.dark" title="实验室总数" status={stats.labCount} icon={<BusinessIcon />} />
      </Grid>
      {/* 信息列表区域美化 */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* 最近的项目 */}
        <Grid item xs={12} md={8}>
          <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>最近的项目</Typography>
              <Divider />
              <List sx={{ p: 0 }}>
                {recentProjects.length > 0 ? recentProjects.map((project) => (
                  <ListItemButton key={project.id} onClick={() => navigate(ROUTES.PROJECTS.DETAILS.replace(':id', String(project.id)))} sx={{ borderRadius: 2, mb: 1, transition: 'background 0.2s', '&:hover': { background: '#e3f2fd' } }}>
                    <ListItemText primary={project.name} secondary={`负责人: ${project.projectLeadName}`} />
                    <ArrowForwardIcon color="action" />
                  </ListItemButton>
                )) : <Typography color="text.secondary" sx={{p: 2}}>暂无项目</Typography>}
              </List>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
              <Button size="small" variant="outlined" onClick={() => navigate(ROUTES.PROJECTS.LIST)}>查看全部项目</Button>
            </CardActions>
          </Card>
        </Grid>
        {/* 待处理的申请 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>待处理的申请</Typography>
              <Divider />
              <List sx={{ p: 0 }}>
                {pendingRequestsList.length > 0 ? pendingRequestsList.map((req) => (
                  <ListItem key={req.id} sx={{ borderRadius: 2, mb: 1, transition: 'background 0.2s', '&:hover': { background: '#fffde7' } }}>
                    <ListItemText 
                      primary={`${req.applicantName} 申请了 ${req.resourceName}`} 
                      secondary={`类型: ${req.requestType}`} 
                      primaryTypographyProps={{ noWrap: true, textOverflow: 'ellipsis' }}
                    />
                  </ListItem>
                )) : <Typography color="text.secondary" sx={{p: 2}}>暂无待处理申请</Typography>}
              </List>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
              <Button size="small" variant="outlined" onClick={() => navigate(ROUTES.RESOURCES.REQUESTS)}>处理全部申请</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OverviewPage;
