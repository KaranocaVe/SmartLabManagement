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
import type { ExperimentReportCreateDTO, ReportVersionCreateDTO } from '../../../../client';

interface ReportFormProps {
    open: boolean;
    onClose: () => void;
    projectId: number;
    onCreate: (dto: ExperimentReportCreateDTO) => Promise<void>;
}

const ReportForm: React.FC<ReportFormProps> = ({ open, onClose, projectId, onCreate }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [form, setForm] = useState<ExperimentReportCreateDTO>({
        projectId,
        title: '',
        initialContent: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm((prev) => ({ ...prev, projectId }));
    }, [projectId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.initialContent) {
            enqueueSnackbar('请填写标题和内容', { variant: 'warning' });
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
            <DialogTitle>创建新实验报告</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="报告标题"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        disabled={loading}
                    />
                    <TextField
                        label="初始内容"
                        name="initialContent"
                        value={form.initialContent}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={6}
                        required
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

export default ReportForm;
