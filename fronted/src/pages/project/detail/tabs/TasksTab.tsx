import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Card,
    CardContent,
    CircularProgress,
    Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';

// 导入API和相关类型
import { projectTaskApi } from '../../../../api';
import type { ProjectVO, ProjectTask, ProjectTaskCreateDTO, ProjectTaskUpdateDTO} from '../../../../client/api';
// TODO : 需要实现任务创建和更新的API调用
// 导入通用组件
import ConfirmationDialog from '../../../../components/common/ConfirmationDialog';
import TaskForm from './TaskForm'; // 理想情况下，表单会是一个独立组件

/**
 * 项目任务管理标签页
 * @description 一个迷你的任务管理器，用于查看、创建、更新和删除项目下的任务。
 */
const TasksTab: React.FC = () => {
    const { project } = useOutletContext<{ project: ProjectVO }>();
    const { enqueueSnackbar } = useSnackbar();

    // --- State Management ---
    const [tasks, setTasks] = useState<ProjectTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false); // 控制表单弹窗
    const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);

    // --- Data Fetching ---
    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await projectTaskApi.getTasksByProjectId(project.id);
            if (response.data.code === 200 && response.data.data) {
                setTasks(response.data.data);
            } else {
                throw new Error(response.data.message || '获取任务列表失败');
            }
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [project.id, enqueueSnackbar]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // --- Event Handlers ---
    const handleOpenCreateForm = () => {
        setIsFormOpen(true);
    };
    const handleOpenEditForm = (task: ProjectTask) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingTask(null);
    };

    const handleCreateTask = async (dto: ProjectTaskCreateDTO) => {
        try {
            const response = await projectTaskApi.createTask(dto);
            if (response.data.code === 200 && response.data.data) {
                setTasks(prev => response.data.data ? [...prev, response.data.data] : prev);
                enqueueSnackbar('任务创建成功', { variant: 'success' });
                setIsFormOpen(false);
            } else {
                throw new Error(response.data.message || '创建失败');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                enqueueSnackbar(error.message || '创建失败', { variant: 'error' });
            } else {
                enqueueSnackbar('创建失败', { variant: 'error' });
            }
        }
    };

    const handleUpdateTask = async (dto: ProjectTaskUpdateDTO) => {
        if (!editingTask || typeof editingTask.id !== 'number') return;
        try {
            const response = await projectTaskApi.updateTask(editingTask.id, dto);
            if (response.data.code === 200 && response.data.data) {
                setTasks(prev => prev.map(t => t.id === editingTask.id ? response.data.data : t));
                enqueueSnackbar('任务更新成功', { variant: 'success' });
                setIsFormOpen(false);
                setEditingTask(null);
            } else {
                throw new Error(response.data.message || '更新失败');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                enqueueSnackbar(error.message || '更新失败', { variant: 'error' });
            } else {
                enqueueSnackbar('更新失败', { variant: 'error' });
            }
        }
    };

    const handleOpenDeleteDialog = (id: number) => {
        setDeletingTaskId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingTaskId) return;
        try {
            await projectTaskApi.deleteTask(deletingTaskId);
            setTasks(prevTasks => prevTasks.filter(t => t.id !== deletingTaskId));
            enqueueSnackbar('任务删除成功', { variant: 'success' });
        } catch (error: unknown) {
            if (error instanceof Error) {
                enqueueSnackbar(error.message || '删除失败', { variant: 'error' });
            } else {
                enqueueSnackbar('删除失败', { variant: 'error' });
            }
        } finally {
            setDeletingTaskId(null);
        }
    };

    // --- Renderer ---
    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">任务列表</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateForm}>
                        创建任务
                    </Button>
                </Box>
                <Divider />
                {tasks.length > 0 ? (
                    <List>
                        {tasks.map((task, index) => (
                            <React.Fragment key={task.id}>
                                <ListItem
                                    secondaryAction={
                                        <>
                                            <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEditForm(task)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="delete" sx={{ ml: 1 }} onClick={() => typeof task.id === 'number' && handleOpenDeleteDialog(task.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    }
                                >
                                    <ListItemText
                                        primary={task.name}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="text.primary">
                                                    {task.description || '暂无描述'}
                                                </Typography>
                                                <Box component="span" sx={{ display: 'block', mt: 1 }}>
                                                    <Chip label={`状态: ${task.status}`} size="small" sx={{ mr: 1 }} />
                                                    <Chip label={`截止日期: ${task.dueDate as string }`} size="small" />
                                                </Box>
                                            </>
                                        }
                                    />
                                </ListItem>
                                {index < tasks.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Typography sx={{ mt: 3, textAlign: 'center' }} color="text.secondary">
                        该项目下还没有任何任务。
                    </Typography>
                )}
            </CardContent>

            {/* Confirmation Dialog for deleting a task */}
            <ConfirmationDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="确认删除任务"
                content="您确定要删除这个任务吗？此操作不可撤销。"
            />

            {/* TODO: Add TaskForm Dialog here */}
            <TaskForm
                open={isFormOpen}
                onClose={handleCloseForm}
                projectId={typeof project.id === 'number' ? project.id : 0}
                onCreate={handleCreateTask}
                onUpdate={handleUpdateTask}
                editingTask={editingTask}
            />
        </Card>
    );
};

export default TasksTab;
