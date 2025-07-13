import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Chip } from '@mui/material';
import { useSnackbar } from 'notistack';
import type {GridColDef} from '@mui/x-data-grid';

// 导入物资相关的API和类型
import { materialApi } from '../../api';
import type { Material, PageRequestDTO, MaterialCreateDTO, MaterialUpdateDTO } from '../../client';

// 导入通用组件和物资专用表单
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import MaterialForm from '../../components/specific/material/MaterialForm';

/**
 * 物资管理页面
 * @description 使用“蓝本”模式创建的物资CRUD页面。
 */
const MaterialPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    // --- State Management ---
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

    // --- Data Fetching ---
    const fetchMaterials = useCallback(async () => {
        setIsLoading(true);
        try {
            const pageRequest: PageRequestDTO = {
                pageNum: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
            };
            const response = await materialApi.getMaterialPage(pageRequest);
            if (response.data.code === 200 && response.data.data) {
                setMaterials(response.data.data.records || []);
                setTotalRows(response.data.data.total || 0);
            } else {
                throw new Error(response.data.message || '获取物资列表失败');
            }
        } catch (error: any) {
            enqueueSnackbar(error.message || '网络请求失败', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [paginationModel, enqueueSnackbar]);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    // --- Event Handlers ---
    const handleAddNew = () => {
        setEditingMaterial(null);
        setIsFormOpen(true);
    };

    const handleEdit = (row: { id: string | number; name?: string; specification?: string; unit?: string; currentStock?: number; lowStockThreshold?: number; storageLocation?: string; createdAt?: string; updatedAt?: string; }) => {
        // Convert id to number if possible
        const id = typeof row.id === 'string' ? Number(row.id) : row.id;
        setEditingMaterial({
            ...row,
            id: id as number | undefined,
        } as Material);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (data: MaterialCreateDTO | MaterialUpdateDTO) => {
        try {
            if ('id' in data) {
                await materialApi.updateMaterial(data.id, data);
                enqueueSnackbar('物资更新成功', { variant: 'success' });
            } else {
                await materialApi.createMaterial(data);
                enqueueSnackbar('物资新增成功', { variant: 'success' });
            }
            setIsFormOpen(false);
            fetchMaterials(); // 成功后刷新列表
        } catch (error: any) {
            enqueueSnackbar(error.message || '操作失败', { variant: 'error' });
        }
    };

    // --- Table Columns Definition ---
    const columns: GridColDef<Material>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: '物资名称', flex: 2 },
        { field: 'specification', headerName: '规格型号', flex: 2 },
        { field: 'unit', headerName: '单位', flex: 1 },
        { field: 'currentStock', headerName: '当前库存', flex: 1 },
        { field: 'lowStockThreshold', headerName: '库存预警值', flex: 1 },
        { field: 'storageLocation', headerName: '存放位置', flex: 2 },
        {
            field: 'status',
            headerName: '库存状态',
            flex: 1,
            renderCell: (params) => {
                const isLowStock = (params.row.currentStock ?? 0) <= (params.row.lowStockThreshold ?? 0);
                return (
                    <Chip
                        label={isLowStock ? '库存不足' : '充足'}
                        color={isLowStock ? 'error' : 'success'}
                        size="small"
                    />
                );
            },
        },
        { field: 'createdAt', headerName: '创建时间', flex: 2 },
        { field: 'updatedAt', headerName: '更新时间', flex: 2 },
    ];

    return (
        <Container maxWidth={false}>
            <PageHeader
                title="物资管理"
                buttonText="新增物资"
                onButtonClick={handleAddNew}
            />
            <Box mt={3}>
                <DataTable
                    rows={materials.map((m, idx) => ({
                        ...m,
                        id: m.id !== undefined ? m.id : `row-${idx}`,
                    }))}
                    columns={columns}
                    loading={isLoading}
                    rowCount={totalRows}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    onEdit={handleEdit}
                    // 注意：根据您提供的API文档，物资管理没有删除功能
                />
            </Box>

            <MaterialForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingMaterial}
            />
        </Container>
    );
};

export default MaterialPage;
