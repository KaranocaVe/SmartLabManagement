import React, { useEffect, useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Box,
    OutlinedInput,
} from '@mui/material';

// 导入相关的API和类型
import { roleApi } from '../../../api';
import type { UserVO, UserCreateDTO, UserUpdateDTO, Role } from '../../../client/api';

// 定义组件的Props接口
interface UserFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: UserCreateDTO | UserUpdateDTO) => void;
    initialData?: UserVO | null;
}

// 定义表单的数据类型
type FormValues = {
    username: string;
    password?: string;
    realName: string;
    email?: string;
    phone?: string;
    roleIds?: number[];
};

/**
 * 用户创建/编辑表单组件
 * @description 封装在一个弹窗中，并能动态加载角色列表用于分配。
 */
const UserForm: React.FC<UserFormProps> = ({
                                               open,
                                               onClose,
                                               onSubmit,
                                               initialData,
                                           }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const isEditMode = !!initialData;

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    // 获取所有角色
    useEffect(() => {
        if (open) {
            roleApi.getAllRoles().then(response => {
                if (response.data.code === 200 && response.data.data) {
                    setRoles(response.data.data);
                }
            });
        }
    }, [open]);

    // 根据模式重置表单
    useEffect(() => {
        if (open) {
            if (initialData) {
                reset({
                    ...initialData,
                    roleIds: initialData.roles?.map(role => role.id) || [],
                });
            } else {
                reset({
                    username: '',
                    password: '',
                    realName: '',
                    email: '',
                    phone: '',
                    roleIds: [],
                });
            }
        }
    }, [initialData, open, reset]);

    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        if (isEditMode) {
            onSubmit({ id: initialData.id, ...data });
        } else {
            onSubmit(data as UserCreateDTO);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditMode ? '编辑用户' : '新增用户'}</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12 }} component="div">
                            <TextField {...register('username', { required: '用户名是必填项' })} label="用户名" fullWidth required disabled={isEditMode} error={!!errors.username} helperText={errors.username?.message} />
                        </Grid>
                        {!isEditMode && (
                            <Grid size={{ xs: 12 }} component="div">
                                <TextField {...register('password', { required: '密码是必填项' })} label="密码" type="password" fullWidth required error={!!errors.password} helperText={errors.password?.message} />
                            </Grid>
                        )}
                        <Grid size={{ xs: 12, sm: 6 }} component="div">
                            <TextField {...register('realName', { required: '真实姓名是必填项' })} label="真实姓名" fullWidth required error={!!errors.realName} helperText={errors.realName?.message} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} component="div">
                            <TextField {...register('phone')} label="电话" fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12 }} component="div">
                            <TextField {...register('email')} label="邮箱" type="email" fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12 }} component="div">
                            <FormControl fullWidth>
                                <InputLabel id="role-select-label">角色</InputLabel>
                                <Controller
                                    name="roleIds"
                                    control={control}
                                    defaultValue={[]}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId="role-select-label"
                                            multiple
                                            input={<OutlinedInput label="角色" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {(selected as number[]).map((value) => (
                                                        <Chip key={value} label={roles.find(r => r.id === value)?.roleName} />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {roles.map((role) => (
                                                <MenuItem key={role.id} value={role.id}>
                                                    {role.roleName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
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

export default UserForm;
