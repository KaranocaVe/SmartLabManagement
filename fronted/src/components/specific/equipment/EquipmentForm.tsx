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

// 导入设备相关的API类型
import type { Equipment, EquipmentCreateDTO, EquipmentUpdateDTO } from '../../../client';

// 定义组件的Props接口
interface EquipmentFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: EquipmentCreateDTO | EquipmentUpdateDTO) => void;
    initialData?: Equipment | null;
}

// 定义表单的数据类型
type FormValues = {
    name: string;
    assetNumber: string;
    model?: string;
    purchaseDate?: string;
    maintenanceCycleDays?: number;
};

/**
 * 设备创建/编辑表单组件
 * @description 封装在一个弹窗中，用于处理设备信息的增改操作。
 */
const EquipmentForm: React.FC<EquipmentFormProps> = ({
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
                // 编辑模式：用初始数据填充表单，并格式化日期
                reset({
                    ...initialData,
                    purchaseDate: initialData.purchaseDate
                        ? new Date(initialData.purchaseDate).toISOString().split('T')[0]
                        : '',
                });
            } else {
                // 新增模式：清空表单并设置默认值
                reset({
                    name: '',
                    assetNumber: '',
                    model: '',
                    purchaseDate: '',
                    maintenanceCycleDays: 30,
                });
            }
        }
    }, [initialData, open, reset]);

    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        // 在提交前处理数据格式
        const processedData = {
            ...data,
            purchaseDate: data.purchaseDate ? new Date(data.purchaseDate).toISOString() : undefined,
            maintenanceCycleDays: data.maintenanceCycleDays ? Number(data.maintenanceCycleDays) : undefined,
        };

        if (initialData?.id) {
            onSubmit({ id: initialData.id, ...processedData });
        } else {
            onSubmit(processedData);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? '编辑设备' : '新增设备'}</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField {...register('name', { required: '设备名称是必填项' })} label="设备名称" fullWidth required error={!!errors.name} helperText={errors.name?.message} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField {...register('assetNumber', { required: '资产编号是必填项' })} label="资产编号" fullWidth required error={!!errors.assetNumber} helperText={errors.assetNumber?.message} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField {...register('model')} label="设备型号" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField {...register('purchaseDate')} label="采购日期" type="date" InputLabelProps={{ shrink: true }} fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField {...register('maintenanceCycleDays')} label="维护周期（天）" type="number" fullWidth />
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

export default EquipmentForm;
