import React, { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

// 导入相关的API类型
import type { ResourceRequestCreateDTO } from '../../../client/api';

// 定义组件的Props接口
interface ResourceRequestFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ResourceRequestCreateDTO) => void;
}

// 定义表单的数据类型
type FormValues = {
    requestType: 'EQUIPMENT' | 'MATERIAL' | 'LAB_SPACE';
    resourceId: number;
    quantity?: number;
    startTime?: string;
    endTime?: string;
    purpose?: string;
};

/**
 * 资源申请创建表单组件
 */
const ResourceRequestForm: React.FC<ResourceRequestFormProps> = ({
                                                                     open,
                                                                     onClose,
                                                                     onSubmit,
                                                                 }) => {
    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    const requestType = watch('requestType');

    useEffect(() => {
        if (open) {
            reset({
                requestType: 'EQUIPMENT',
                resourceId: undefined,
                quantity: 1,
                startTime: '',
                endTime: '',
                purpose: '',
            });
        }
    }, [open, reset]);

    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        const processedData = {
            ...data,
            resourceId: Number(data.resourceId),
            quantity: data.quantity ? Number(data.quantity) : undefined,
            startTime: data.startTime ? new Date(data.startTime).toISOString() : undefined,
            endTime: data.endTime ? new Date(data.endTime).toISOString() : undefined,
        };
        onSubmit(processedData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>创建资源申请</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="request-type-label">申请类型</InputLabel>
                                <Controller
                                    name="requestType"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select {...field} labelId="request-type-label" label="申请类型">
                                            <MenuItem value="EQUIPMENT">设备</MenuItem>
                                            <MenuItem value="MATERIAL">物资</MenuItem>
                                            <MenuItem value="LAB_SPACE">实验室场地</MenuItem>
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField {...register('resourceId', { required: '资源ID是必填项' })} label="资源ID" type="number" fullWidth required error={!!errors.resourceId} helperText={errors.resourceId?.message} />
                        </Grid>
                        {requestType === 'MATERIAL' && (
                            <Grid item xs={12}>
                                <TextField {...register('quantity')} label="数量" type="number" fullWidth />
                            </Grid>
                        )}
                        {(requestType === 'EQUIPMENT' || requestType === 'LAB_SPACE') && (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <TextField {...register('startTime')} label="开始时间" type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField {...register('endTime')} label="结束时间" type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth />
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12}>
                            <TextField {...register('purpose')} label="申请目的" fullWidth multiline rows={3} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button onClick={onClose} disabled={isSubmitting}>取消</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? '提交中...' : '提交申请'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ResourceRequestForm;
