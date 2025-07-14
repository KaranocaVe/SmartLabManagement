import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';

// 导入API和相关类型
import { projectApi } from '../../../../api';
import type { ProjectVO, ProjectMemberVO } from '../../../../client';
// 导入我们之前创建的通用组件
import ConfirmationDialog from '../../../../components/common/ConfirmationDialog';
import AddMemberDialog from './AddMemberDialog';


/**
 * 项目概览标签页
 * @description 显示项目的详细描述、日期和成员列表，并提供成员管理功能。
 */
const OverviewTab: React.FC = () => {
    // 使用 useOutletContext 获取从父路由（ProjectDetailPage）传递过来的项目数据
    const { project } = useOutletContext<{ project: ProjectVO }>();
    const { enqueueSnackbar } = useSnackbar();

    // --- State Management ---
    // 使用本地 state 来管理成员列表，以便在增删后能即时更新UI
    const [members, setMembers] = useState<ProjectMemberVO[]>(project.members || []);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingMember, setDeletingMember] = useState<ProjectMemberVO | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // --- Event Handlers ---
    const handleOpenAddMemberDialog = () => {
        setIsAddDialogOpen(true);
    };
    const handleCloseAddMemberDialog = () => {
        setIsAddDialogOpen(false);
    };
    const handleAddMember = (newMember: ProjectMemberVO) => {
        setMembers(prev => [...prev, newMember]);
    };

    const handleOpenDeleteDialog = (member: ProjectMemberVO) => {
        setDeletingMember(member);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingMember) return;
        if (typeof project.id !== 'number') {
            enqueueSnackbar('项目ID无效，无法移除成员', { variant: 'error' });
            return;
        }
        try {
            await projectApi.removeMemberFromProject(project.id, deletingMember.userId);
            // 从本地 state 中移除该成员，以即时更新UI
            setMembers(prevMembers => prevMembers.filter(m => m.userId !== deletingMember.userId));
            enqueueSnackbar('成员移除成功', { variant: 'success' });
        } catch (error: unknown) {
            if (error instanceof Error) {
                enqueueSnackbar(error.message || '移除失败', { variant: 'error' });
            } else {
                enqueueSnackbar('移除失败', { variant: 'error' });
            }
        } finally {
            setDeletingMember(null);
        }
    };

    // 格式化日期函数
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Grid container spacing={3}>
            {/* Left Column: Project Details */}
            <Grid item xs={12} md={8}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>项目描述</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                            {project.description || '暂无详细描述。'}
                        </Typography>
                        <Divider sx={{ my: 3 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">开始日期</Typography>
                                <Typography variant="body1">{formatDate(project.startDate)}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">结束日期</Typography>
                                <Typography variant="body1">{formatDate(project.endDate)}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* Right Column: Project Members */}
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">项目成员</Typography>
                            <Button size="small" onClick={handleOpenAddMemberDialog}>添加成员</Button>
                        </Box>
                        <List>
                            {members.map((member) => (
                                <ListItem
                                    key={member.userId}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(member)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                    disablePadding
                                >
                                    <ListItemText
                                        primary={member.realName}
                                        secondary={`角色: ${member.roleInProject}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            {/* 添加成员弹窗 */}
            <AddMemberDialog
                open={isAddDialogOpen}
                onClose={handleCloseAddMemberDialog}
                projectId={project.id}
                onAdd={handleAddMember}
            />

            {/* Confirmation Dialog for deleting a member */}
            <ConfirmationDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="确认移除成员"
                content={`您确定要从项目中移除成员 "${deletingMember?.realName}" 吗？`}
            />
        </Grid>
    );
};

export default OverviewTab;
