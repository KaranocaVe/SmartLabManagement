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

// 导入实验室相关的API类型
import type { Lab, LabCreateDTO, LabUpdateDTO } from '../../../client';

// 定义组件的Props接口
interface LabFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: LabCreateDTO | LabUpdateDTO) => void;
    initialData?: Lab | null;
}

// 定义表单的数据类型
type FormValues = {
    name: string;
    location?: string;
    managerName?: string;
};

/**
 * 实验室创建/编辑表单组件
 * @description 封装在一个弹窗中，用于处理实验室信息的增改操作。
 */
const LabForm: React.FC<LabFormProps> = ({
                                             open,
                                             onClose,
                                             onSubmit,
                                             initialData,
                                         }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    useEffect(() => {
        if (open) {
            if (initialData) {
                // 编辑模式
                reset(initialData);
            } else {
                // 新增模式
                reset({
                    name: '',
                    location: '',
                    managerName: '',
                });
            }
        }
    }, [initialData, open, reset]);

    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        if (initialData?.id) {
            onSubmit({ id: initialData.id, ...data });
        } else {
            onSubmit(data);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? '编辑实验室' : '新增实验室'}</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField {...register('name', { required: '实验室名称是必填项' })} label="实验室名称" fullWidth required error={!!errors.name} helperText={errors.name?.message} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField {...register('location')} label="位置" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField {...register('managerName')} label="负责人" fullWidth />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button onClick={onClose} disabled={isSubmitting}>取消</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? '保存中...' : '保存'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default LabForm;
