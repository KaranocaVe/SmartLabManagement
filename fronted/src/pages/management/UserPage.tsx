import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Chip } from '@mui/material';
import { useSnackbar } from 'notistack';
import type {GridColDef, GridRowId} from '@mui/x-data-grid';

// 导入用户相关的API和类型
import { userApi } from '../../api';
import type { UserVO, PageRequestDTO, UserCreateDTO, UserUpdateDTO } from '../../client';

// 导入通用组件和用户专用表单
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import UserForm from '../../components/specific/user/UserForm';

/**
 * 用户管理页面
 * @description 使用“蓝本”模式创建的用户CRUD页面。
 */
const UserPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    // --- State Management ---
    const [users, setUsers] = useState<UserVO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserVO | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<GridRowId | null>(null);

    // --- Data Fetching ---
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const pageRequest: PageRequestDTO = {
                pageNum: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
            };
            const response = await userApi.getUserPage(pageRequest);
            if (response.data.code === 200 && response.data.data) {
                setUsers(response.data.data.records || []);
                setTotalRows(response.data.data.total || 0);
            } else {
                throw new Error(response.data.message || '获取用户列表失败');
            }
        } catch (error: any) {
            enqueueSnackbar(error.message || '网络请求失败', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [paginationModel, enqueueSnackbar]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // --- Event Handlers ---
    const handleAddNew = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const handleEdit = (user: UserVO) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleDelete = (id: GridRowId) => {
        setDeletingUserId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingUserId) return;
        try {
            await userApi.deleteUser(deletingUserId as number);
            enqueueSnackbar('用户删除成功', { variant: 'success' });
            fetchUsers(); // 重新获取数据
        } catch (error: any) {
            enqueueSnackbar(error.message || '删除失败', { variant: 'error' });
        } finally {
            setDeletingUserId(null);
        }
    };

    const handleFormSubmit = async (data: UserCreateDTO | UserUpdateDTO) => {
        try {
            if ('id' in data) {
                await userApi.updateUser(data.id, data);
                enqueueSnackbar('用户更新成功', { variant: 'success' });
            } else {
                await userApi.createUser(data);
                enqueueSnackbar('用户新增成功', { variant: 'success' });
            }
            setIsFormOpen(false);
            fetchUsers(); // 成功后刷新列表
        } catch (error: any) {
            enqueueSnackbar(error.message || '操作失败', { variant: 'error' });
        }
    };

    // --- Table Columns Definition ---
    const columns: GridColDef<UserVO>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'username', headerName: '用户名', flex: 1 },
        { field: 'realName', headerName: '真实姓名', flex: 1 },
        { field: 'email', headerName: '邮箱', flex: 2 },
        { field: 'phone', headerName: '电话', flex: 1 },
        {
            field: 'roles',
            headerName: '角色',
            flex: 2,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {params.row.roles?.map((role) => (
                        <Chip key={role.id} label={role.roleName} size="small" />
                    ))}
                </Box>
            ),
        },
        {
            field: 'status',
            headerName: '状态',
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value === 1 ? '正常' : '禁用'}
                    color={params.value === 1 ? 'success' : 'error'}
                    size="small"
                />
            ),
        },
    ];

    return (
        <Container maxWidth={false}>
            <PageHeader
                title="用户管理"
                buttonText="新增用户"
                onButtonClick={handleAddNew}
            />
            <Box mt={3}>
                <DataTable
                    rows={users}
                    columns={columns}
                    loading={isLoading}
                    rowCount={totalRows}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Box>

            <UserForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingUser}
            />

            <ConfirmationDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="确认删除"
                content="您确定要删除这个用户吗？此操作不可撤销。"
            />
        </Container>
    );
};

export default UserPage;
