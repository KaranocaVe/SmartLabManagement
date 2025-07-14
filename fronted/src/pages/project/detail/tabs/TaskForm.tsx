import React, { useState, useEffect } from 'react';
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
import type { ProjectTaskCreateDTO, ProjectTaskUpdateDTO, ProjectTask } from '../../../../client/api';

interface TaskFormProps {
    open: boolean;
    onClose: () => void;
    projectId: number;
    onCreate: (task: ProjectTaskCreateDTO) => Promise<void>;
    onUpdate?: (task: ProjectTaskUpdateDTO) => Promise<void>;
    editingTask?: ProjectTask | null;
}

const statusOptions = [
    { value: '未开始', label: '未开始' },
    { value: '进行中', label: '进行中' },
    { value: '已完成', label: '已完成' },
];

const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, projectId, onCreate, onUpdate, editingTask }) => {
    const { enqueueSnackbar } = useSnackbar();
    const isEdit = Boolean(editingTask);
    const [form, setForm] = useState<ProjectTaskCreateDTO | ProjectTaskUpdateDTO>({
        name: '',
        description: '',
        status: '未开始',
        dueDate: '',
        projectId: projectId,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit && editingTask) {
            setForm({
                name: editingTask.name ?? '',
                description: editingTask.description ?? '',
                status: editingTask.status ?? '未开始',
                dueDate: editingTask.dueDate ?? '',
                assignedToUserId: editingTask.assignedToUserId,
            });
        } else {
            setForm({
                name: '',
                description: '',
                status: '未开始',
                dueDate: '',
                projectId: projectId,
            });
        }
    }, [isEdit, editingTask, projectId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.dueDate) {
            enqueueSnackbar('请填写任务名称和截止日期', { variant: 'warning' });
            return;
        }
        setLoading(true);
        try {
            if (isEdit && onUpdate) {
                await onUpdate(form as ProjectTaskUpdateDTO);
            } else {
                await onCreate({ ...(form as ProjectTaskCreateDTO), projectId });
            }
            onClose();
        } catch (error: unknown) {
            if (error instanceof Error) {
                enqueueSnackbar(error.message || (isEdit ? '更新失败' : '创建失败'), { variant: 'error' });
            } else {
                enqueueSnackbar(isEdit ? '更新失败' : '创建失败', { variant: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>{isEdit ? '编辑任务' : '创建任务'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="任务名称"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        disabled={loading}
                    />
                    <TextField
                        label="描述"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={2}
                        disabled={loading}
                    />
                    <TextField
                        select
                        label="状态"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        disabled={loading}
                    >
                        {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="截止日期"
                        name="dueDate"
                        type="date"
                        value={form.dueDate}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                        disabled={loading}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>取消</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={20} /> : isEdit ? '保存' : '创建'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TaskForm;
