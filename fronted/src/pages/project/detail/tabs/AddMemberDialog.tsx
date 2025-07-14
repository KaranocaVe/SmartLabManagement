import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { projectApi } from '../../../../api';
import type { AddProjectMemberDTO, ProjectMemberVO } from '../../../../client';

interface AddMemberDialogProps {
    open: boolean;
    onClose: () => void;
    projectId: number;
    onAdd: (member: ProjectMemberVO) => void;
}

const roles = [
    { value: '成员', label: '成员' },
    { value: '负责人', label: '负责人' },
    // 可根据实际角色补充
];

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({ open, onClose, projectId, onAdd }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [form, setForm] = useState<AddProjectMemberDTO>({ projectId, userId: 0, roleInProject: '' });
    const [loading, setLoading] = useState(false);

    // 保证 projectId 始终与 props 保持一致
    React.useEffect(() => {
        setForm((prev) => ({ ...prev, projectId }));
    }, [projectId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === 'userId' ? Number(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.userId || !form.roleInProject) {
            enqueueSnackbar('请填写完整信息', { variant: 'warning' });
            return;
        }
        setLoading(true);
        try {
            const res = await projectApi.addMemberToProject(form);
            if (res.data.code === 200 && res.data.data) {
                enqueueSnackbar('成员添加成功', { variant: 'success' });
                onAdd(res.data.data);
                onClose();
            } else {
                throw new Error(res.data.message || '添加失败');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                enqueueSnackbar(error.message || '添加失败', { variant: 'error' });
            } else {
                enqueueSnackbar('添加失败', { variant: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>添加项目成员</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="用户ID"
                        name="userId"
                        value={form.userId}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        disabled={loading}
                    />
                    <TextField
                        select
                        label="角色"
                        name="roleInProject"
                        value={form.roleInProject}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        disabled={loading}
                    >
                        {roles.map((role) => (
                            <MenuItem key={role.value} value={role.value}>
                                {role.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>取消</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={20} /> : '添加'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddMemberDialog;
