import React, { useState, useEffect } from "react";
import { useParams, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Skeleton,
} from "@mui/material";
import { useSnackbar } from "notistack";

// 导入API和相关类型
import { projectApi } from "../../../api";
import type { ProjectVO } from "../../../client";
import { ROUTES } from "../../../router/paths";

// 定义标签页的配置
const TABS_CONFIG = [
  { label: "项目概览", value: "overview" },
  { label: "任务管理", value: "tasks" },
  { label: "实验记录", value: "records" },
  { label: "实验报告", value: "reports" },
  { label: "风险评估", value: "assessments" },
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
  const [currentTab, setCurrentTab] = useState("overview");
  // 记录已加载的项目ID，避免重复请求
  const [loadedId, setLoadedId] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    if (!id || loadedId === id) return;
    setIsLoading(true);
    projectApi
      .getProjectById(Number(id))
      .then((response) => {
        if (response.data && response.data.code === 200 && response.data.data) {
          setProject(response.data.data);
          setLoadedId(id);
        } else {
          enqueueSnackbar("获取项目详情失败", { variant: "error" });
          navigate("/projects");
        }
      })
      .catch((error) => {
        if (error.response?.data) {
          enqueueSnackbar(
            `接口错误: ${error.response.data.message || "未知错误"}`,
            { variant: "error" }
          );
        } else {
          enqueueSnackbar("无法加载项目详情，请稍后重试", { variant: "error" });
        }
        navigate("/projects");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, loadedId, enqueueSnackbar, navigate]);

  // --- Tab Synchronization with URL ---
  useEffect(() => {
    // 根据当前URL路径确定活动的标签页
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    const tabValue = TABS_CONFIG.find(
      (tab) => tab.value === lastSegment
    )?.value;

    // 如果URL的最后一部分是项目ID，则默认为'overview'
    if (lastSegment === id) {
      setCurrentTab("overview");
    } else if (tabValue) {
      setCurrentTab(tabValue);
    }
  }, [location.pathname, id]);

  // --- Event Handlers ---
  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    // 导航到对应的子路由，例如 /projects/123/tasks
    const basePath = ROUTES.PROJECTS.DETAILS.replace(":id", id!);
    navigate(newValue === "overview" ? basePath : `${basePath}/${newValue}`);
  };

  if (isLoading) {
    // 骨架屏替代加载动画
    return (
      <Container maxWidth={false}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width={240} height={48} />
            <Skeleton
              variant="rectangular"
              width={120}
              height={32}
              sx={{ mt: 2 }}
            />
          </CardContent>
        </Card>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mt: 3,
            bgcolor: "background.paper",
          }}
        >
          <Skeleton variant="rectangular" width={480} height={48} />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Skeleton variant="rectangular" width="100%" height={320} />
        </Box>
      </Container>
    );
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
          <Chip
            label={`负责人: ${project.projectLeadName || "N/A"}`}
            size="small"
          />
        </CardContent>
      </Card>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mt: 3,
          bgcolor: "background.paper",
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="项目详情标签页"
        >
          {TABS_CONFIG.map((tab) => (
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
