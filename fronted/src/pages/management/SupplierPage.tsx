import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container } from '@mui/material';
import { useSnackbar } from 'notistack';
import type {GridColDef, GridRowId} from '@mui/x-data-grid';

// 导入API和相关类型
import { supplierApi } from '../../api';
import type { Supplier, PageRequestDTO, SupplierCreateDTO, SupplierUpdateDTO } from '../../client/api';

// 导入我们创建的所有组件
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import SupplierForm from '../../components/specific/supplier/SupplierForm';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';

/**
 * 供应商管理页面 (最终整合版)
 * @description 整合了数据获取、表格展示、新增、编辑、删除等所有功能。
 */
const SupplierPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    // --- State Management ---
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    // Dialog and Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [deletingSupplierId, setDeletingSupplierId] = useState<GridRowId | null>(null);

    // --- Data Fetching ---
    const fetchSuppliers = useCallback(async () => {
        setIsLoading(true);
        try {
            const pageRequest: PageRequestDTO = {
                pageNum: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
            };
            const response = await supplierApi.getSupplierPage(pageRequest);
            if (response.data.code === 200 && response.data.data) {
                setSuppliers(response.data.data.records || []);
                setTotalRows(response.data.data.total || 0);
            } else {
                throw new Error(response.data.message || '获取供应商列表失败');
            }
        } catch (error: any) {
            enqueueSnackbar(error.message || '网络请求失败', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [paginationModel, enqueueSnackbar]);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    // --- Event Handlers ---
    const handleAddNew = () => {
        setEditingSupplier(null);
        setIsFormOpen(true);
    };

    const handleEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setIsFormOpen(true);
    };

    const handleDelete = (id: GridRowId) => {
        setDeletingSupplierId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingSupplierId) return;
        try {
            await supplierApi.deleteSupplier(deletingSupplierId as number);
            enqueueSnackbar('供应商删除成功', { variant: 'success' });
            fetchSuppliers(); // 重新获取数据
        } catch (error: any) {
            enqueueSnackbar(error.message || '删除失败', { variant: 'error' });
        } finally {
            setDeletingSupplierId(null);
        }
    };

    const handleFormSubmit = async (data: SupplierCreateDTO | SupplierUpdateDTO) => {
        try {
            if ('id' in data) {
                // 编辑模式
                await supplierApi.updateSupplier(data.id, data);
                enqueueSnackbar('供应商更新成功', { variant: 'success' });
            } else {
                // 新增模式
                await supplierApi.createSupplier(data);
                enqueueSnackbar('供应商新增成功', { variant: 'success' });
            }
            setIsFormOpen(false);
            fetchSuppliers(); // 成功后刷新列表
        } catch (error: any) {
            enqueueSnackbar(error.message || '操作失败', { variant: 'error' });
        }
    };

    // --- Table Columns Definition ---
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: '供应商名称', flex: 1 },
        { field: 'contactPerson', headerName: '联系人', flex: 1 },
        { field: 'contactPhone', headerName: '联系电话', flex: 1 },
        { field: 'address', headerName: '地址', flex: 2 },
    ];

    return (
        <Container maxWidth={false}>
            <PageHeader
                title="供应商管理"
                buttonText="新增供应商"
                onButtonClick={handleAddNew}
            />
            <Box mt={3}>
                <DataTable
                    rows={suppliers}
                    columns={columns}
                    loading={isLoading}
                    rowCount={totalRows}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Box>

            <SupplierForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingSupplier}
            />

            <ConfirmationDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="确认删除"
                content="您确定要删除这个供应商吗？此操作不可撤销。"
            />
        </Container>
    );
};

export default SupplierPage;
