import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
} from '@mui/material';

// 导入相关的API类型
import type { SafetyIncidentCreateDTO } from '../../../client';

// 定义组件的Props接口
interface SafetyIncidentFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: SafetyIncidentCreateDTO) => void;
}

// 定义表单的数据类型
type FormValues = {
    labId?: number;
    incidentTime: string;
    description: string;
    actionsTaken?: string;
};

/**
 * 安全事件记录表单组件
 */
const SafetyIncidentForm: React.FC<SafetyIncidentFormProps> = ({
                                                                   open,
                                                                   onClose,
                                                                   onSubmit,
                                                               }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    useEffect(() => {
        if (open) {
            reset({
                labId: undefined,
                incidentTime: new Date().toISOString().slice(0, 16), // 默认当前时间
                description: '',
                actionsTaken: '',
            });
        }
    }, [open, reset]);

    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        const processedData = {
            ...data,
            labId: data.labId ? Number(data.labId) : undefined,
            incidentTime: new Date(data.incidentTime).toISOString(),
        };
        onSubmit(processedData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>记录新的安全事件</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField {...register('incidentTime', { required: '事发时间是必填项' })} label="事发时间" type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth required error={!!errors.incidentTime} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField {...register('labId')} label="相关实验室ID (可选)" type="number" fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField {...register('description', { required: '事件描述是必填项' })} label="事件描述" fullWidth multiline rows={4} required error={!!errors.description} helperText={errors.description?.message} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField {...register('actionsTaken')} label="已采取措施" fullWidth multiline rows={3} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button onClick={onClose} disabled={isSubmitting}>取消</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? '记录中...' : '确认记录'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SafetyIncidentForm;
