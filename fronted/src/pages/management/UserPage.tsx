import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, Chip } from "@mui/material";
import { useSnackbar } from "notistack";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";

// 导入用户相关的API和类型
import { userApi } from "../../api";
import type {
  UserVO,
  PageRequestDTO,
  UserCreateDTO,
  UserUpdateDTO,
  AssignRolesToUserDTO,
} from "../../client";

// 导入通用组件和用户专用表单
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";
import UserForm from "../../components/specific/user/UserForm";

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
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
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
        throw new Error(response.data.message || "获取用户列表失败");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "网络请求失败";
      enqueueSnackbar(errorMessage, { variant: "error" });
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

  const handleEdit = (row: { id: GridRowId }) => {
    const user = users.find((u) => u.id === row.id);
    if (user) {
      setEditingUser(user);
      setIsFormOpen(true);
    }
  };

  const handleDelete = (id: GridRowId) => {
    setDeletingUserId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUserId) return;
    try {
      await userApi.deleteUser(deletingUserId as number);
      enqueueSnackbar("用户删除成功", { variant: "success" });
      fetchUsers(); // 重新获取数据
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "删除失败";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleFormSubmit = async (data: UserCreateDTO | UserUpdateDTO) => {
    try {
      if ("id" in data) {
        // 用于TypeScript类型安全
        interface FormDataWithRoleIds extends UserUpdateDTO {
          roleIds?: number[];
        }

        // 安全转换数据类型
        const formData = data as FormDataWithRoleIds;
        const roleIds = formData.roleIds;

        // 从数据中移除roleIds，因为updateUser API不接受这个字段
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { roleIds: omitted, ...userData } = formData;

        // 1. 先更新用户基本信息
        await userApi.updateUser(data.id, userData);

        // 2. 如果有角色信息，单独处理角色分配
        if (roleIds && Array.isArray(roleIds)) {
          await userApi.assignRolesToUser({
            userId: data.id,
            roleIds: roleIds,
          });
        }

        enqueueSnackbar("用户信息和权限更新成功", { variant: "success" });
      } else {
        // 创建用户，保持原有逻辑
        await userApi.createUser(data);
        enqueueSnackbar("用户新增成功", { variant: "success" });
      }
      setIsFormOpen(false);
      fetchUsers(); // 成功后刷新列表
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "操作失败";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  // --- Table Columns Definition ---
  const columns: GridColDef<UserVO>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "username", headerName: "用户名", flex: 1 },
    { field: "realName", headerName: "真实姓名", flex: 1 },
    { field: "email", headerName: "邮箱", flex: 2 },
    { field: "phone", headerName: "电话", flex: 1 },
    {
      field: "roles",
      headerName: "角色",
      flex: 2,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            alignItems: "center",
            height: "100%",
          }}
        >
          {params.row.roles?.map((role) => (
            <Chip key={role} label={role} size="small" />
          ))}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "状态",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value === 1 ? "正常" : "禁用"}
          color={params.value === 1 ? "success" : "error"}
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
          rows={users.map((user) => ({
            ...user,
            id: user.id ?? `user-${Math.random()}`, // 使用空值合并运算符
          }))}
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
