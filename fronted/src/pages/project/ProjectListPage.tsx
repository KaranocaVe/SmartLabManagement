import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { useSnackbar } from 'notistack';

// 导入API和相关类型
import { projectApi } from '../../api';
import type { ProjectVO, PageRequestDTO } from '../../client';
import { ROUTES } from '../../router/paths';

// 导入通用组件
import PageHeader from '../../components/common/PageHeader';
// import ProjectForm from '../../components/specific/project/ProjectForm'; // 我们将在后续步骤中创建和集成此组件

/**
 * 项目列表页面
 * @description 展示所有项目的列表，并作为项目管理的入口。
 */
const ProjectListPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    // --- State Management ---
    const [projects, setProjects] = useState<ProjectVO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1); // MUI Pagination 的页码从1开始
    const [totalPages, setTotalPages] = useState(0);
    // const [isFormOpen, setIsFormOpen] = useState(false); // 用于控制新增表单的显示

    // --- Data Fetching ---
    const fetchProjects = useCallback(async (currentPage: number) => {
        setIsLoading(true);
        try {
            const pageRequest: PageRequestDTO = {
                pageNum: currentPage,
                pageSize: 9, // 每页显示9个项目卡片，方便3列布局
            };
            const response = await projectApi.getProjectPage(pageRequest);
            if (response.data.code === 200 && response.data.data) {
                setProjects(response.data.data.records || []);
                setTotalPages(response.data.data.pages || 0);
            } else {
                throw new Error(response.data.message || '获取项目列表失败');
            }
        } catch (error: any) {
            enqueueSnackbar(error.message || '网络请求失败', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        fetchProjects(page);
    }, [fetchProjects, page]);

    // --- Event Handlers ---
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleAddNew = () => {
        // setIsFormOpen(true);
        enqueueSnackbar('新增项目功能待实现', { variant: 'info' });
    };

    const handleViewDetails = (id: number) => {
        // 使用我们定义的路由常量来导航到详情页
        navigate(ROUTES.PROJECTS.DETAILS.replace(':id', String(id)));
    };

    return (
        <Container maxWidth={false}>
            <PageHeader
                title="项目管理"
                buttonText="创建新项目"
                onButtonClick={handleAddNew}
            />

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
            ) : (
                <>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        {projects.map((project) => (
                            <Grid item key={project.id} xs={12} sm={6} md={4}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {project.name}
                                        </Typography>
                                        <Box sx={{ mb: 1 }}>
                                            <Chip label={`负责人: ${project.projectLeadName || 'N/A'}`} size="small" />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            height: 60, // 限制描述区域的高度
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3, // 最多显示3行
                                            WebkitBoxOrient: 'vertical',
                                        }}>
                                            {project.description || '暂无描述'}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={() => handleViewDetails(project.id)}>查看详情</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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

            {/* 占位符：新增/编辑项目表单
        <ProjectForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      */}
        </Container>
    );
};

export default ProjectListPage;
