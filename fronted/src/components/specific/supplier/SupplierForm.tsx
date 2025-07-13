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

// 导入API客户端中定义的类型
import type { Supplier, SupplierCreateDTO, SupplierUpdateDTO } from '../../../client';

// --- 定义组件的Props接口 ---
interface SupplierFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: SupplierCreateDTO | SupplierUpdateDTO) => void;
    initialData?: Supplier | null; // 用于编辑模式，传入当前供应商的数据
}

// 定义表单的数据类型
type FormValues = {
    name: string;
    contactPerson?: string;
    contactPhone?: string;
    address?: string;
};

/**
 * 供应商创建/编辑表单组件
 * @description 封装在一个弹窗中，用于处理供应商信息的增改操作。
 */
const SupplierForm: React.FC<SupplierFormProps> = ({
                                                       open,
                                                       onClose,
                                                       onSubmit,
                                                       initialData,
                                                   }) => {
    // --- React Hook Form 初始化 ---
    const {
        register,
        handleSubmit,
        reset, // 用于重置表单
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    // ---副作用处理---
    // 使用 useEffect 来监听 initialData 和 open 状态的变化
    useEffect(() => {
        if (open) {
            // 当弹窗打开时，根据是否存在 initialData 来重置表单
            if (initialData) {
                // 编辑模式：用初始数据填充表单
                reset(initialData);
            } else {
                // 新增模式：清空表单
                reset({
                    name: '',
                    contactPerson: '',
                    contactPhone: '',
                    address: '',
                });
            }
        }
    }, [initialData, open, reset]);

    // --- 表单提交处理 ---
    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        // 调用父组件传入的 onSubmit 函数，并传递处理后的数据
        if (initialData?.id) {
            // 编辑模式
            onSubmit({ id: initialData.id, ...data });
        } else {
            // 新增模式
            onSubmit(data);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {initialData ? '编辑供应商' : '新增供应商'}
            </DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12 }} component="div">
                            <TextField
                                {...register('name', { required: '供应商名称是必填项' })}
                                label="供应商名称"
                                fullWidth
                                required
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} component="div">
                            <TextField
                                {...register('contactPerson')}
                                label="联系人"
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} component="div">
                            <TextField
                                {...register('contactPhone')}
                                label="联系电话"
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }} component="div">
                            <TextField
                                {...register('address')}
                                label="地址"
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button onClick={onClose} disabled={isSubmitting}>取消</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? '保存中...' : '保存'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SupplierForm;
