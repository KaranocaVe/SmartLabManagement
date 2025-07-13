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

// 导入角色相关的API类型
import type { RoleCreateDTO } from '../../../client';

// 定义组件的Props接口
interface RoleFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: RoleCreateDTO) => void;
}

// 定义表单的数据类型
type FormValues = {
    roleName: string;
    description?: string;
};

/**
 * 角色创建表单组件
 * @description 封装在一个弹窗中，用于处理新增角色的操作。
 */
const RoleForm: React.FC<RoleFormProps> = ({
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
            // 弹窗打开时清空表单
            reset({ roleName: '', description: '' });
        }
    }, [open, reset]);

    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>新增角色</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField {...register('roleName', { required: '角色名称是必填项' })} label="角色名称" fullWidth required error={!!errors.roleName} helperText={errors.roleName?.message} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField {...register('description')} label="描述" fullWidth multiline rows={3} />
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

export default RoleForm;
