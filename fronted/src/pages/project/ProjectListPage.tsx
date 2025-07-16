import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Pagination,
  Chip,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { useSnackbar, closeSnackbar } from "notistack";

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
// 提取关闭按钮组件，避免ESLint警告
const CloseButton = ({ snackbarKey }: { snackbarKey: string | number }) => (
  <Button
    color="inherit"
    size="small"
    onClick={() => closeSnackbar(snackbarKey)}
  >
    关闭
  </Button>
);

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
        // 由于我们的API拦截器已经处理了非200的情况，这里只需处理成功响应
        setProjects(response.data.data?.records || []);
        // 计算总页数：总记录数除以每页大小，向上取整
        const total = response.data.data?.total || 0;
        const pageSize = pageRequest.pageSize || 9;
        setTotalPages(Math.ceil(total / pageSize));
      } catch (error: unknown) {
        // 只在非401错误时显示错误消息（401已由拦截器处理）
        // 检查错误是否是401状态，避免重复显示"未认证"错误
        const apiError = error as Error & { status?: number };
        if (apiError.status !== 401) {
          enqueueSnackbar(apiError.message || "获取项目列表失败", {
            variant: "error",
            autoHideDuration: 3000, // 3秒后自动消失
          });
        }

        // 出错时清空项目列表和页数
        setProjects([]);
        setTotalPages(0);
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
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
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
      try {
        // 显示加载中提示
        enqueueSnackbar("正在创建项目，请稍候...", {
          variant: "info",
          autoHideDuration: 2000, // 2秒后自动消失
        });

        await projectApi.createProject(data as ProjectCreateDTO);

        // 显示成功提示
        enqueueSnackbar("项目创建成功", {
          variant: "success",
          autoHideDuration: 3000, // 3秒后自动消失
        });

        // 关闭表单并刷新数据
        setIsFormOpen(false);
        fetchProjects(1);
        setPage(1);
      } catch (error: unknown) {
        // 显示错误消息，但使用更友好的格式
        if (error instanceof Error) {
          // 提取主要错误信息，避免显示技术细节
          let errorMsg = error.message;
          if (errorMsg.includes("project_lead_id")) {
            errorMsg = "项目负责人无效，请重新选择";
          } else if (errorMsg.includes("name")) {
            errorMsg = "项目名称无效或已存在";
          }

          enqueueSnackbar(errorMsg, {
            variant: "error",
            autoHideDuration: 5000, // 错误消息显示时间更长
            action: (key) => <CloseButton snackbarKey={key} />,
          });
        } else {
          enqueueSnackbar("创建项目失败，请稍后重试", {
            variant: "error",
            autoHideDuration: 3000,
          });
        }
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
        <Grid
          container
          spacing={3}
          sx={{
            mt: 1,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          {["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((key) => (
            <Grid key={`skeleton-${key}`} component="div">
              {" "}
              <Card
                sx={{
                  minHeight: "500px", // 将最小高度增加到500px
                  width: "100%", // 确保卡片宽度填满Grid单元格
                  borderRadius: 3,
                  boxShadow: 4,
                  background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
                  overflow: "hidden",
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: 2,
                    width: "100%", // 使用全宽度
                  }}
                >
                  <Box>
                    <Skeleton
                      variant="text"
                      width="70%"
                      height={32}
                      sx={{ mb: 1 }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={24}
                      sx={{ mb: 1.5, borderRadius: 1 }}
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1, my: 1 }}>
                    <Skeleton variant="text" width="100%" height={15} />
                    <Skeleton variant="text" width="100%" height={15} />
                    <Skeleton variant="text" width="90%" height={15} />
                    <Skeleton variant="text" width="100%" height={15} />
                    <Skeleton variant="text" width="95%" height={15} />
                    <Skeleton variant="text" width="90%" height={15} />
                    <Skeleton variant="text" width="100%" height={15} />
                    <Skeleton variant="text" width="85%" height={15} />
                    <Skeleton variant="text" width="95%" height={15} />
                    <Skeleton variant="text" width="80%" height={15} />
                    <Skeleton variant="text" width="85%" height={15} />
                    <Skeleton variant="text" width="90%" height={15} />
                    <Skeleton variant="text" width="70%" height={15} />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={36}
                      sx={{ borderRadius: 1 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Grid
            container
            spacing={3}
            sx={{
              mt: 1,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
            }}
          >
            {projects.map((project) => (
              <Grid key={project.id} component="div">
                <Card
                  sx={{
                    minHeight: "500px", // 将最小高度增加到500px
                    width: "100%", // 确保卡片宽度填满Grid单元格
                    borderRadius: 3,
                    boxShadow: 4,
                    transition: "box-shadow 0.3s, transform 0.2s",
                    background:
                      "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
                    "&:hover": {
                      boxShadow: 8,
                      transform: "translateY(-4px) scale(1.02)",
                    },
                    overflow: "hidden", // 确保内容不溢出
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between", // 内容垂直分布
                      p: 2, // 减少内边距，增加内容空间
                      width: "100%", // 使用全宽度
                    }}
                  >
                    <Box>
                      <Tooltip
                        title={
                          <Typography
                            sx={{ p: 0.5, fontSize: 12, fontWeight: 600 }}
                          >
                            {project.name}
                          </Typography>
                        }
                        placement="top"
                        arrow
                        enterDelay={0}
                        leaveDelay={100}
                        slotProps={{
                          popper: {
                            sx: {
                              maxWidth: "300px",
                            },
                          },
                          tooltip: {
                            sx: {
                              bgcolor: "rgba(50, 50, 50, 0.9)",
                              padding: "6px 10px",
                              "& .MuiTooltip-arrow": {
                                color: "rgba(50, 50, 50, 0.9)",
                              },
                            },
                          },
                        }}
                      >
                        <Typography
                          variant="h4"
                          component="h2"
                          sx={{
                            fontWeight: 700,
                            letterSpacing: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2, // 增加标题可能的行数
                            WebkitBoxOrient: "vertical",
                            mb: 2, // 增加底部间距
                            maxWidth: "100%",
                            cursor: "pointer", // 添加指针光标提示用户可交互
                            fontSize: "1.6rem", // 增大字体
                          }}
                        >
                          {project.name}
                        </Typography>
                      </Tooltip>
                      <Chip
                        label={`负责人: ${project.projectLeadName || "N/A"}`}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 500, mb: 1.5, borderRadius: 1 }}
                      />
                    </Box>
                    <Box sx={{ flexGrow: 1, my: 1 }}>
                      <Tooltip
                        title={
                          <Typography sx={{ p: 0.5, fontSize: 11 }}>
                            {project.description || "暂无描述"}
                          </Typography>
                        }
                        placement="top"
                        arrow
                        enterDelay={0}
                        leaveDelay={100}
                        slotProps={{
                          popper: {
                            sx: {
                              maxWidth: "250px",
                            },
                          },
                          tooltip: {
                            sx: {
                              bgcolor: "rgba(50, 50, 50, 0.9)",
                              padding: "4px 8px",
                              "& .MuiTooltip-arrow": {
                                color: "rgba(50, 50, 50, 0.9)",
                              },
                            },
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: 14,
                            lineHeight: 1.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 15, // 大幅增加显示行数，适应500px高度的卡片
                            WebkitBoxOrient: "vertical",
                            whiteSpace: "pre-line",
                            wordBreak: "break-word",
                            cursor: "pointer", // 添加指针光标提示用户可交互
                          }}
                        >
                          {project.description || "暂无描述"}
                        </Typography>
                      </Tooltip>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewDetails(project.id ?? 0)}
                        sx={{ borderRadius: 1, fontWeight: 500 }}
                      >
                        查看详情
                      </Button>
                    </Box>
                  </CardContent>
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
