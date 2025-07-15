import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Pagination,
  Chip,
} from "@mui/material";
import { useSnackbar } from "notistack";

// 导入API和相关类型
import { projectApi } from "../../api";
import type {
  ProjectVO,
  PageRequestDTO,
  ProjectCreateDTO,
  ProjectUpdateDTO,
} from "../../client";
import { ROUTES } from "../../router/paths";

// 导入通用组件和项目表单
import PageHeader from "../../components/common/PageHeader";
import ProjectForm from "../../components/specific/project/ProjectForm";

/**
 * 项目列表页面 (完善版)
 * @description 展示所有项目的列表，并提供创建新项目的功能。
 */
const ProjectListPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // --- State Management ---
  const [projects, setProjects] = useState<ProjectVO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // --- Data Fetching ---
  const fetchProjects = useCallback(
    async (currentPage: number) => {
      setIsLoading(true);
      try {
        const pageRequest: PageRequestDTO = {
          pageNum: currentPage,
          pageSize: 9,
        };
        const response = await projectApi.getProjectPage(pageRequest);
        if (response.data.code === 200 && response.data.data) {
          setProjects(response.data.data.records || []);
          setTotalPages(response.data.data.pages || 0);
        } else {
          throw new Error(response.data.message || "获取项目列表失败");
        }
      } catch (error: any) {
        enqueueSnackbar(error.message || "网络请求失败", { variant: "error" });
      } finally {
        setIsLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    fetchProjects(page);
  }, [fetchProjects, page]);

  // --- Event Handlers ---
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleAddNew = () => {
    setIsFormOpen(true);
  };

  const handleViewDetails = (id: number) => {
    navigate(ROUTES.PROJECTS.DETAILS.replace(":id", String(id)));
  };

  const handleFormSubmit = async (
    data: ProjectCreateDTO | ProjectUpdateDTO
  ) => {
    if ("name" in data) {
      // 处理创建逻辑
      try {
        await projectApi.createProject(data as ProjectCreateDTO);
        enqueueSnackbar("项目创建成功", { variant: "success" });
        setIsFormOpen(false);
        fetchProjects(1); // 创建成功后，回到第一页并刷新
        setPage(1);
      } catch (error: unknown) {
        enqueueSnackbar((error as Error).message || "创建失败", {
          variant: "error",
        });
      }
    }
  };

  return (
    <Container maxWidth={false}>
      <PageHeader
        title="项目管理"
        buttonText="创建新项目"
        onButtonClick={handleAddNew}
      />

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {projects.map((project) => (
              <Grid
                key={project.id}
                size={{ xs: 12, sm: 6, md: 4 }}
                component="div"
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    boxShadow: 4,
                    transition: "box-shadow 0.3s, transform 0.2s",
                    background:
                      "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
                    "&:hover": {
                      boxShadow: 8,
                      transform: "translateY(-4px) scale(1.02)",
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      sx={{ fontWeight: 700, letterSpacing: 1 }}
                    >
                      {project.name}
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={`负责人: ${project.projectLeadName || "N/A"}`}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        // 只在卡片列表页限制高度，详情页不限制
                        fontSize: 15,
                        lineHeight: 1.6,
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                        mb: 1,
                      }}
                    >
                      {project.description || "暂无描述"}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetails(project.id ?? 0)}
                      sx={{ borderRadius: 2, fontWeight: 500 }}
                    >
                      查看详情
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      <ProjectForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </Container>
  );
};

export default ProjectListPage;
