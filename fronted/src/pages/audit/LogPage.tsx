import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Container,
    Typography,
    Card,
    Grid,
    TextField,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSnackbar } from 'notistack';
import type {GridColDef} from '@mui/x-data-grid';

// 导入API和相关类型
// 假设您已在api/index.ts中导出了logApi
import type { AuditLogVO, AuditLogQueryDTO } from '../../client';

// 导入通用组件
import DataTable from '../../components/common/DataTable';
import {logApi} from "../../api";

type FilterFormValues = Omit<AuditLogQueryDTO, 'pageNum' | 'pageSize'>;

/**
 * 日志审计页面
 */
const LogPage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, reset } = useForm<FilterFormValues>();

    // --- State Management ---
    const [logs, setLogs] = useState<AuditLogVO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [filters, setFilters] = useState<FilterFormValues>({});

    // --- Data Fetching ---
    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const queryDTO: AuditLogQueryDTO = {
                ...filters,
                pageNum: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
            };
            // 清理空的过滤条件
            Object.keys(queryDTO).forEach(key => {
                const typedKey = key as keyof AuditLogQueryDTO;
                if (queryDTO[typedKey] === '' || queryDTO[typedKey] === null || queryDTO[typedKey] === undefined) {
                    delete queryDTO[typedKey];
                }
            });

            const response = await logApi.getAuditLogs(queryDTO);
            if (response.data.code === 200 && response.data.data) {
                setLogs(response.data.data.records || []);
                setTotalRows(response.data.data.total || 0);
            } else {
                throw new Error(response.data.message || '获取审计日志失败');
            }
        } catch (error: any) {
            enqueueSnackbar(error.message || '网络请求失败', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [paginationModel, filters, enqueueSnackbar]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // --- Event Handlers ---
    const handleFilterSubmit = (data: FilterFormValues) => {
        setFilters(data);
    };

    const handleResetFilters = () => {
        reset({ userId: undefined, action: '', targetType: '', startTime: undefined, endTime: undefined });
        setFilters({});
    };

    // --- Table Columns Definition ---
    const columns: GridColDef<AuditLogVO>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'userName', headerName: '操作人', flex: 1 },
        { field: 'action', headerName: '动作', flex: 1.5 },
        // { field: 'targetType', headerName: '目标类型', flex: 1 },
        // { field: 'targetId', headerName: '目标ID', flex: 1 },
        { field: 'ipAddress', headerName: 'IP地址', flex: 1 },
        { field: 'createdAt', headerName: '操作时间', flex: 1.5},
    ];

    return (
        <Container maxWidth={false}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                日志审计
            </Typography>

            <Accordion sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>筛选查询</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box component="form" onSubmit={handleSubmit(handleFilterSubmit)} noValidate>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
                                <TextField {...register('userId')} label="用户ID" fullWidth size="small" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
                                <TextField {...register('action')} label="动作" fullWidth size="small" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
                                <TextField {...register('targetType')} label="目标类型" fullWidth size="small" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
                                <TextField {...register('startTime')} label="开始时间" type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth size="small" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
                                <TextField {...register('endTime')} label="结束时间" type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth size="small" />
                            </Grid>
                            <Grid size={{ xs: 12 }} component="div" sx={{ display: 'flex', gap: 2 }}>
                                <Button type="submit" variant="contained">查询</Button>
                                <Button variant="outlined" onClick={handleResetFilters}>重置</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Card>
                <DataTable
                    rows={logs.map(log => ({
                        ...log,
                        id: log.id !== undefined ? log.id : `row-${Math.random()}`
                    }))}
                    columns={columns}
                    loading={isLoading}
                    rowCount={totalRows}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                />
            </Card>
        </Container>
    );
};

export default LogPage;
