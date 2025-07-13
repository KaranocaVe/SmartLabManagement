import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container } from '@mui/material';
import { useSnackbar } from 'notistack';
import type {GridColDef} from '@mui/x-data-grid';

// 导入API和相关类型
import { safetyIncidentApi } from '../../api';
import type { SafetyIncidentVO, PageRequestDTO, SafetyIncidentCreateDTO } from '../../client';

// 导入通用组件和专用表单
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import SafetyIncidentForm from '../../components/specific/safety/SafetyIncidentForm';

/**
 * 安全事件管理页面
 */
const IncidentPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    // --- State Management ---
    const [incidents, setIncidents] = useState<SafetyIncidentVO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [isFormOpen, setIsFormOpen] = useState(false);

    // --- Data Fetching ---
    const fetchIncidents = useCallback(async () => {
        setIsLoading(true);
        try {
            const pageRequest: PageRequestDTO = {
                pageNum: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
            };
            const response = await safetyIncidentApi.getIncidentPage(pageRequest);
            if (response.data.code === 200 && response.data.data) {
                setIncidents(response.data.data.records || []);
                setTotalRows(response.data.data.total || 0);
            } else {
                throw new Error(response.data.message || '获取安全事件列表失败');
            }
        } catch (error: any) {
            enqueueSnackbar(error.message || '网络请求失败', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [paginationModel, enqueueSnackbar]);

    useEffect(() => {
        fetchIncidents();
    }, [fetchIncidents]);

    // --- Event Handlers ---
    const handleRecordIncident = async (data: SafetyIncidentCreateDTO) => {
        try {
            await safetyIncidentApi.recordIncident(data);
            enqueueSnackbar('安全事件记录成功', { variant: 'success' });
            setIsFormOpen(false);
            fetchIncidents();
        } catch (error: any) {
            enqueueSnackbar(error.message || '记录失败', { variant: 'error' });
        }
    };

    // --- Table Columns Definition ---
    const columns: GridColDef<SafetyIncidentVO>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'labName', headerName: '相关实验室', flex: 1 },
        { field: 'incidentTime', headerName: '事发时间', flex: 1.5, valueFormatter: (params) => new Date(params.value).toLocaleString() },
        { field: 'description', headerName: '事件描述', flex: 2 },
        { field: 'actionsTaken', headerName: '已采取措施', flex: 2 },
        { field: 'reporterName', headerName: '报告人', flex: 1 },
    ];

    return (
        <Container maxWidth={false}>
            <PageHeader
                title="安全事件管理"
                buttonText="记录新事件"
                onButtonClick={() => setIsFormOpen(true)}
            />
            <Box mt={3}>
                <DataTable
                    rows={incidents}
                    columns={columns}
                    loading={isLoading}
                    rowCount={totalRows}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    // 注意：根据API，此页面主要用于记录和查看，不提供编辑/删除功能
                />
            </Box>

            <SafetyIncidentForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleRecordIncident}
            />
        </Container>
    );
};

export default IncidentPage;
