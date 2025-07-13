import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useSnackbar } from 'notistack';
import {type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// 导入API、状态管理和相关类型
import { resourceRequestApi } from '../../api';
import { useAuthStore } from '../../store/authStore';
import type { ResourceRequestVO, ResourceRequestQueryDTO, ResourceRequestCreateDTO } from '../../client';

// 导入通用组件和专用表单
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ResourceRequestForm from '../../components/specific/resource/ResourceRequestForm';

/**
 * 资源申请管理页面
 */
const RequestPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const user = useAuthStore((state) => state.user);
    // 假设管理员角色名称为 'ADMIN' 或 'LAB_MANAGER'
    const isAdmin = user?.roles?.some(role => ['ADMIN', 'LAB_MANAGER'].includes(role.roleName));

    // --- State Management ---
    const [requests, setRequests] = useState<ResourceRequestVO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [isFormOpen, setIsFormOpen] = useState(false);

    // --- Data Fetching ---
    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const queryDTO: ResourceRequestQueryDTO = {
                pageNum: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
                // 如果不是管理员，可以只查询自己的申请，这需要后端支持
                // userId: isAdmin ? undefined : user?.id,
            };
            const response = await resourceRequestApi.getRequests(queryDTO);
            if (response.data.code === 200 && response.data.data) {
                setRequests(response.data.data.records || []);
                setTotalRows(response.data.data.total || 0);
            } else {
                throw new Error(response.data.message || '获取申请列表失败');
            }
        } catch (error: any) {
            enqueueSnackbar(error.message || '网络请求失败', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [paginationModel, enqueueSnackbar, isAdmin, user?.id]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // --- Event Handlers ---
    const handleCreateRequest = async (data: ResourceRequestCreateDTO) => {
        try {
            await resourceRequestApi.createResourceRequest(data);
            enqueueSnackbar('申请提交成功', { variant: 'success' });
            setIsFormOpen(false);
            fetchRequests();
        } catch (error: any) {
            enqueueSnackbar(error.message || '提交失败', { variant: 'error' });
        }
    };

    const handleApprove = async (id: number, status: 'APPROVED' | 'REJECTED') => {
        try {
            await resourceRequestApi.approveResourceRequest({ requestId: id, status });
            enqueueSnackbar(`申请已${status === 'APPROVED' ? '批准' : '驳回'}`, { variant: 'success' });
            fetchRequests();
        } catch (error: any) {
            enqueueSnackbar(error.message || '操作失败', { variant: 'error' });
        }
    };

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'PENDING': return <Chip label="待审批" color="warning" size="small" />;
            case 'APPROVED': return <Chip label="已批准" color="success" size="small" />;
            case 'REJECTED': return <Chip label="已驳回" color="error" size="small" />;
            case 'CANCELED': return <Chip label="已取消" color="default" size="small" />;
            default: return <Chip label={status} size="small" />;
        }
    };

    // --- Table Columns Definition ---
    const columns: GridColDef<ResourceRequestVO>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'requesterName', headerName: '申请人', flex: 1 },
        { field: 'requestType', headerName: '申请类型', flex: 1 },
        { field: 'resourceId', headerName: '资源ID', flex: 1 },
        { field: 'status', headerName: '状态', flex: 1, renderCell: (params) => getStatusChip(params.value) },
        { field: 'createTime', headerName: '申请时间', flex: 1.5, valueFormatter: (params) => new Date(params.value).toLocaleString() },
        {
            field: 'actions',
            type: 'actions',
            headerName: '审批操作',
            width: 150,
            cellClassName: 'actions',
            getActions: ({ row }) => {
                if (isAdmin && row.status === 'PENDING') {
                    return [
                        <GridActionsCellItem icon={<CheckCircleIcon />} label="Approve" onClick={() => handleApprove(row.id, 'APPROVED')} color="success" />,
                        <GridActionsCellItem icon={<CancelIcon />} label="Reject" onClick={() => handleApprove(row.id, 'REJECTED')} color="error" />,
                    ];
                }
                return [];
            },
        },
    ];

    return (
        <Container maxWidth={false}>
            <PageHeader
                title="资源申请管理"
                buttonText="创建新申请"
                onButtonClick={() => setIsFormOpen(true)}
            />
            <Box mt={3}>
                <DataTable
                    rows={requests}
                    columns={columns}
                    loading={isLoading}
                    rowCount={totalRows}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                />
            </Box>

            <ResourceRequestForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleCreateRequest}
            />
        </Container>
    );
};

export default RequestPage;
