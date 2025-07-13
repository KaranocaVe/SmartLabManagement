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

// 导入物资相关的API类型
import type { Material, MaterialCreateDTO, MaterialUpdateDTO } from '../../../client';

// 定义组件的Props接口
interface MaterialFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: MaterialCreateDTO | MaterialUpdateDTO) => void;
    initialData?: Material | null;
}

// 定义表单的数据类型
type FormValues = {
    name: string;
    specification?: string;
    stock?: number;
    warningStock?: number;
};

/**
 * 物资创建/编辑表单组件
 * @description 封装在一个弹窗中，用于处理物资信息的增改操作。
 */
const MaterialForm: React.FC<MaterialFormProps> = ({
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
                    specification: '',
                    stock: 0,
                    warningStock: 10,
                });
            }
        }
    }, [initialData, open, reset]);

    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        // 在提交前处理数据格式
        const processedData = {
            ...data,
            stock: data.stock ? Number(data.stock) : 0,
            warningStock: data.warningStock ? Number(data.warningStock) : 0,
        };

        if (initialData?.id) {
            onSubmit({ id: initialData.id, ...processedData });
        } else {
            onSubmit(processedData);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? '编辑物资' : '新增物资'}</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12 }} component="div">
                            <TextField {...register('name', { required: '物资名称是必填项' })} label="物资名称" fullWidth required error={!!errors.name} helperText={errors.name?.message} />
                        </Grid>
                        <Grid size={{ xs: 12 }} component="div">
                            <TextField {...register('specification')} label="规格型号" fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} component="div">
                            <TextField {...register('stock')} label="当前库存" type="number" fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} component="div">
                            <TextField {...register('warningStock')} label="库存预警值" type="number" fullWidth />
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

export default MaterialForm;
