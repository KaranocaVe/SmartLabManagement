import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
    CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';

// 导入相关的API和类型
import { roleApi, permissionApi } from '../../api';
import type { Role, Permission, RoleCreateDTO } from '../../client';

// 导入组件
import PageHeader from '../../components/common/PageHeader';
import RoleForm from '../../components/specific/role/RoleForm';

// 假设：为了UI能正常工作，我们假设Role对象会包含其permissionIds。
// 在实际项目中，这可能需要一个专门的API (如 getRoleById) 来获取。
type RoleWithPermissions = Role & { permissionIds?: number[] };

/**
 * 角色与权限管理页面
 */
const RolePage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    // --- State Management ---
    const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(null);
    const [permissionSelection, setPermissionSelection] = useState<Record<number, boolean>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [rolesRes, permissionsRes] = await Promise.all([
                roleApi.getAllRoles(),
                permissionApi.getAllPermissions(),
            ]);

            if (rolesRes.data.code === 200 && rolesRes.data.data) {
                setRoles(rolesRes.data.data);
            } else {
                throw new Error(rolesRes.data.message || '获取角色列表失败');
            }

            if (permissionsRes.data.code === 200 && permissionsRes.data.data) {
                setPermissions(permissionsRes.data.data);
            } else {
                throw new Error(permissionsRes.data.message || '获取权限列表失败');
            }
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Event Handlers ---
    const handleSelectRole = (role: RoleWithPermissions) => {
        setSelectedRole(role);
        const newSelection: Record<number, boolean> = {};
        permissions.forEach(p => {
            if (typeof p.id !== 'undefined') {
                newSelection[p.id] = role.permissionIds?.includes(p.id) ?? false;
            }
        });
        setPermissionSelection(newSelection);
    };

    const handlePermissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPermissionSelection({
            ...permissionSelection,
            [event.target.name]: event.target.checked,
        });
    };

    const handleSavePermissions = async () => {
        if (!selectedRole) return;
        setIsSaving(true);
        try {
            const permissionIds = Object.entries(permissionSelection)
                .filter(([, checked]) => checked)
                .map(([id]) => Number(id))
                .filter((id): id is number => typeof id === 'number' && !isNaN(id));

            await roleApi.assignPermissionsToRole({ roleId: selectedRole.id as number, permissionIds: permissionIds as number[] });
            enqueueSnackbar('权限保存成功', { variant: 'success' });
            // 刷新角色列表以获取最新权限（如果API支持）
            fetchData();
        } catch (error: any) {
            enqueueSnackbar(error.message || '保存失败', { variant: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateRole = async (data: RoleCreateDTO) => {
        try {
            await roleApi.createRole(data);
            enqueueSnackbar('角色创建成功', { variant: 'success' });
            setIsFormOpen(false);
            fetchData(); // 刷新列表
        } catch (error: any) {
            enqueueSnackbar(error.message || '创建失败', { variant: 'error' });
        }
    };

    return (
        <Container maxWidth={false}>
            <PageHeader title="角色与权限管理" buttonText="新增角色" onButtonClick={() => setIsFormOpen(true)} />

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
            ) : (
                <Grid container spacing={3} mt={1}>
                    {/* Left Column: Roles List */}
                    <Grid size={{ xs: 12, md: 4}} component="div">
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>角色列表</Typography>
                                <List component="nav">
                                    {roles.map((role) => (
                                        <ListItemButton
                                            key={role.id}
                                            selected={selectedRole?.id === role.id}
                                            onClick={() => handleSelectRole(role)}
                                        >
                                            <ListItemText primary={role.roleName} secondary={role.description} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Column: Permission Assignment */}
                    <Grid size={{ xs: 12, md: 8}} component="div">
                        <Card>
                            <CardContent>
                                {selectedRole ? (
                                    <>
                                        <Typography variant="h6" gutterBottom>为 "{selectedRole.roleName}" 分配权限</Typography>
                                        <Divider sx={{ my: 2 }} />
                                        <FormGroup>
                                            {permissions.map((permission) => (
                                                <FormControlLabel
                                                    key={permission.id}
                                                    control={
                                                        <Checkbox
                                                            checked={permissionSelection[permission.id ?? 0] || false}
                                                            onChange={handlePermissionChange}
                                                            name={String(permission.id ?? 0)}
                                                        />
                                                    }
                                                    label={
                                                        <>
                                                            <strong>{permission.permissionCode || `权限 ${permission.id}`}</strong>
                                                            {permission.module && (
                                                                <span style={{ marginLeft: 8, color: '#888' }}>
                                                                    [{permission.module}]
                                                                </span>
                                                            )}
                                                            {permission.description && (
                                                                <span style={{ marginLeft: 8, color: '#aaa' }}>
                                                                    {permission.description}
                                                                </span>
                                                            )}
                                                        </>
                                                    }
                                                />
                                            ))}
                                        </FormGroup>
                                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button variant="contained" onClick={handleSavePermissions} disabled={isSaving}>
                                                {isSaving ? '保存中...' : '保存权限'}
                                            </Button>
                                        </Box>
                                    </>
                                ) : (
                                    <Typography color="text.secondary">请从左侧选择一个角色以编辑其权限。</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <RoleForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleCreateRole}
            />
        </Container>
    );
};

export default RolePage;
