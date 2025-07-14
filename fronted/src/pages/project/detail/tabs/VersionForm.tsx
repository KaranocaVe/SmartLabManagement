import React, { useState } from 'react';
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
import type { ReportVersionCreateDTO } from '../../../../client';

interface VersionFormProps {
    open: boolean;
    onClose: () => void;
    onCreate: (dto: ReportVersionCreateDTO) => Promise<void>;
}

const VersionForm: React.FC<VersionFormProps> = ({ open, onClose, onCreate }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [form, setForm] = useState<ReportVersionCreateDTO>({
        content: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.content) {
            enqueueSnackbar('请填写报告内容', { variant: 'warning' });
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
            <DialogTitle>创建新报告版本</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="报告内容"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={8}
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

export default VersionForm;
