import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container } from '@mui/material';
import { useSnackbar } from 'notistack';
import type {GridColDef, GridRowId} from '@mui/x-data-grid';

// 导入实验室相关的API和类型
import { labApi } from '../../api';
import type { Lab, PageRequestDTO, LabCreateDTO, LabUpdateDTO } from '../../client';

// 导入通用组件和实验室专用表单
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import LabForm from '../../components/specific/lab/LabForm';

/**
 * 实验室管理页面
 * @description 使用“蓝本”模式创建的实验室CRUD页面。
 */
const LabPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    // --- State Management ---
    const [labs, setLabs] = useState<Lab[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [editingLab, setEditingLab] = useState<Lab | null>(null);
    const [deletingLabId, setDeletingLabId] = useState<GridRowId | null>(null);

    // --- Data Fetching ---
    const fetchLabs = useCallback(async () => {
        setIsLoading(true);
        try {
            const pageRequest: PageRequestDTO = {
                pageNum: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
            };
            const response = await labApi.getLabPage(pageRequest);
            if (response.data.code === 200 && response.data.data) {
                setLabs(response.data.data.records || []);
                setTotalRows(response.data.data.total || 0);
            } else {
                throw new Error(response.data.message || '获取实验室列表失败');
            }
        } catch (error: any) {
            enqueueSnackbar(error.message || '网络请求失败', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [paginationModel, enqueueSnackbar]);

    useEffect(() => {
        fetchLabs();
    }, [fetchLabs]);

    // --- Event Handlers ---
    const handleAddNew = () => {
        setEditingLab(null);
        setIsFormOpen(true);
    };

    const handleEdit = (lab: Lab) => {
        setEditingLab(lab);
        setIsFormOpen(true);
    };

    const handleDelete = (id: GridRowId) => {
        setDeletingLabId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingLabId) return;
        try {
            await labApi.deleteLab(deletingLabId as number);
            enqueueSnackbar('实验室删除成功', { variant: 'success' });
            fetchLabs(); // 重新获取数据
        } catch (error: any) {
            enqueueSnackbar(error.message || '删除失败', { variant: 'error' });
        } finally {
            setDeletingLabId(null);
        }
    };

    const handleFormSubmit = async (data: LabCreateDTO | LabUpdateDTO) => {
        try {
            if ('id' in data) {
                await labApi.updateLab(data.id, data);
                enqueueSnackbar('实验室更新成功', { variant: 'success' });
            } else {
                await labApi.createLab(data);
                enqueueSnackbar('实验室新增成功', { variant: 'success' });
            }
            setIsFormOpen(false);
            fetchLabs(); // 成功后刷新列表
        } catch (error: any) {
            enqueueSnackbar(error.message || '操作失败', { variant: 'error' });
        }
    };

    // --- Table Columns Definition ---
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: '实验室名称', flex: 1 },
        { field: 'location', headerName: '位置', flex: 1 },
        { field: 'managerName', headerName: '负责人', flex: 1 },
    ];

    return (
        <Container maxWidth={false}>
            <PageHeader
                title="实验室管理"
                buttonText="新增实验室"
                onButtonClick={handleAddNew}
            />
            <Box mt={3}>
                <DataTable
                    rows={labs}
                    columns={columns}
                    loading={isLoading}
                    rowCount={totalRows}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Box>

            <LabForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingLab}
            />

            <ConfirmationDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="确认删除"
                content="您确定要删除这个实验室吗？此操作不可撤销。"
            />
        </Container>
    );
};

export default LabPage;
