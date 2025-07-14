import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import type { ExperimentRecordCreateDTO } from '../../../../client';

interface RecordFormProps {
    open: boolean;
    onClose: () => void;
    projectId: number;
    onCreate: (dto: ExperimentRecordCreateDTO) => Promise<void>;
}

const RecordForm: React.FC<RecordFormProps> = ({ open, onClose, projectId, onCreate }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [form, setForm] = useState<ExperimentRecordCreateDTO>({
        projectId,
        content: '',
        structuredData: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            projectId,
            // 保证可选字段类型正确
            structuredData: prev.structuredData ?? '',
        }));
    }, [projectId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.content) {
            enqueueSnackbar('请填写实验内容', { variant: 'warning' });
            return;
        }
        setLoading(true);
        try {
            await onCreate(form);
            onClose();
        } catch (error: unknown) {
            if (error instanceof Error) {
                enqueueSnackbar(error.message || '创建失败', { variant: 'error' });
            } else {
                enqueueSnackbar('创建失败', { variant: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>创建实验记录</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="实验内容"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={6}
                        required
                        disabled={loading}
                    />
                    <TextField
                        label="结构化数据（可选）"
                        name="structuredData"
                        value={form.structuredData}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        disabled={loading}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>取消</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={20} /> : '创建'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default RecordForm;
