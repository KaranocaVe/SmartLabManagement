import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container } from '@mui/material';
import { useSnackbar } from 'notistack';
import type {GridColDef} from '@mui/x-data-grid';

// 导入设备相关的API和类型
import { equipmentApi } from '../../api';
import type { Equipment, PageRequestDTO, EquipmentCreateDTO, EquipmentUpdateDTO } from '../../client';

// 导入通用组件和设备专用表单
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import EquipmentForm from '../../components/specific/equipment/EquipmentForm';

/**
 * 设备管理页面
 * @description 使用“蓝本”模式创建的设备CRUD页面。
 */
const EquipmentPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    // --- State Management ---
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

    // --- Data Fetching ---
    const fetchEquipments = useCallback(async () => {
        setIsLoading(true);
        try {
            const pageRequest: PageRequestDTO = {
                pageNum: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
            };
            const response = await equipmentApi.getEquipmentPage(pageRequest);
            if (response.data.code === 200 && response.data.data) {
                setEquipments(response.data.data.records || []);
                setTotalRows(response.data.data.total || 0);
            } else {
                throw new Error(response.data.message || '获取设备列表失败');
            }
        } catch (error: any) {
            enqueueSnackbar(error.message || '网络请求失败', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [paginationModel, enqueueSnackbar]);

    useEffect(() => {
        fetchEquipments();
    }, [fetchEquipments]);

    // --- Event Handlers ---
    const handleAddNew = () => {
        setEditingEquipment(null);
        setIsFormOpen(true);
    };

    const handleEdit = (equipment: Equipment) => {
        setEditingEquipment(equipment);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (data: EquipmentCreateDTO | EquipmentUpdateDTO) => {
        try {
            if ('id' in data) {
                await equipmentApi.updateEquipment(data.id, data);
                enqueueSnackbar('设备更新成功', { variant: 'success' });
            } else {
                await equipmentApi.createEquipment(data);
                enqueueSnackbar('设备新增成功', { variant: 'success' });
            }
            setIsFormOpen(false);
            fetchEquipments(); // 成功后刷新列表
        } catch (error: any) {
            enqueueSnackbar(error.message || '操作失败', { variant: 'error' });
        }
    };

    // --- Table Columns Definition ---
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: '设备名称', flex: 1 },
        { field: 'assetNumber', headerName: '资产编号', flex: 1 },
        { field: 'model', headerName: '设备型号', flex: 1 },
        { field: 'status', headerName: '状态', flex: 1 },
        {
            field: 'purchaseDate',
            headerName: '采购日期',
            flex: 1,
            valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'N/A',
        },
        { field: 'maintenanceCycleDays', headerName: '维护周期(天)', flex: 1 },
    ];

    return (
        <Container maxWidth={false}>
            <PageHeader
                title="设备管理"
                buttonText="新增设备"
                onButtonClick={handleAddNew}
            />
            <Box mt={3}>
                <DataTable
                    rows={equipments.filter(e => e.id !== undefined).map(e => ({ ...e, id: e.id as number }))}
                    columns={columns}
                    loading={isLoading}
                    rowCount={totalRows}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    onEdit={handleEdit}
                    // 注意：根据您提供的API文档，设备管理没有删除功能，因此这里不传递onDelete属性
                />
            </Box>

            <EquipmentForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingEquipment}
            />
        </Container>
    );
};

export default EquipmentPage;
