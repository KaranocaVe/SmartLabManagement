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
} from "@mui/material";
import { useSnackbar } from "notistack";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ScienceIcon from "@mui/icons-material/Science";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

// 导入API
import {
  projectApi,
  resourceRequestApi,
  materialApi,
  safetyIncidentApi,
} from "../../api";

// 定义统计数据的接口
interface Stats {
  activeProjects: number;
  pendingRequests: number;
  lowStockMaterials: number;
  totalIncidents: number;
}
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
  return status === undefined ? (
    <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
      <Card sx={{ height: "100%", margin: 0, padding: 0 }}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // 水平分布
            height: "100%", // 填充整个卡片
            padding: 0, // 移除默认 padding
          }}
        >
          <Avatar sx={{ bgcolor: "error.main", mr: 2 }}>
            {<WarningAmberIcon />}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              权限不足
            </Typography>
            <Typography color="text.secondary">{title}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ) : (
    <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
      <Card>
        <CardContent sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: bgColor, mr: 2 }}>{icon}</Avatar>
          <Box>
            <Typography variant="h5" component="div">
              {status}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 1, // 限制为 1 行
                WebkitBoxOrient: "vertical",
              }}
            >
              {title}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
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
        const [projectsRes, requestsRes, materialsRes, incidentsRes] =
          await Promise.all([
            projectApi.getProjectPage({ pageNum: 1, pageSize: 1 }),
            resourceRequestApi.getRequests({
              status: "PENDING",
              pageNum: 1,
              pageSize: 1,
            }),
            materialApi.getMaterialPage({ pageNum: 1, pageSize: 999 }), // 获取所有物资以在前端计算低库存
            safetyIncidentApi.getIncidentPage({ pageNum: 1, pageSize: 1 }),
          ]);

        // 计算低库存物资数量
        const lowStockCount =
          materialsRes.data.data?.records?.filter(
            (m) => m.stock <= m.warningStock
          ).length || 0;

        setStats({
          activeProjects: projectsRes.data.data?.total || 0,
          pendingRequests: requestsRes.data.data?.total || 0,
          lowStockMaterials: lowStockCount,
          totalIncidents: incidentsRes.data.data?.total || 0,
        });
      } catch (error) {
        enqueueSnackbar("加载仪表盘数据失败", { variant: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
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
      <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold" }} padding={1}>
        仪表盘
      </Typography>
      <Grid container spacing={2}>
        <GridCard
          bgColor="primary.main"
          title="活动项目"
          status={stats?.activeProjects}
          icon={<AccountTreeIcon />}
        />
        {/* 待审批申请卡片 */}
        <GridCard
          bgColor="secondary.main"
          title="待审批申请"
          status={stats?.pendingRequests}
          icon={<PendingActionsIcon />}
        />

        {/* 低库存物资卡片 */}
        <GridCard
          bgColor="info.main"
          title="低库存物资"
          status={stats?.lowStockMaterials}
          icon={<ScienceIcon />}
        />

        {/* 安全事件总数卡片 */}
        <GridCard
          bgColor="error.main"
          title="安全事件总数"
          status={stats?.totalIncidents}
          icon={<WarningAmberIcon />}
        />
      </Grid>
    </Container>
  );
};

export default OverviewPage;
