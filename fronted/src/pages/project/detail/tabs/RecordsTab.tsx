import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    Card,
    CardContent,
    CircularProgress,
    Pagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';

// 导入API和相关类型
import { experimentRecordApi } from '../../../../api';
import type { ProjectVO, ExperimentRecord, PageRequestDTO, ExperimentRecordCreateDTO } from '../../../../client';
import RecordForm from './RecordForm'; // 理想情况下，表单会是一个独立组件

/**
 * 实验记录标签页
 * @description 以列表形式展示所有与该项目相关的实验记录，并可以创建新的记录。
 */
const RecordsTab: React.FC = () => {
    const { project } = useOutletContext<{ project: ProjectVO }>();
    const { enqueueSnackbar } = useSnackbar();

    // --- State Management ---
    const [records, setRecords] = useState<ExperimentRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // --- Data Fetching ---
    const fetchRecords = useCallback(async (currentPage: number) => {
        setIsLoading(true);
        try {
            const pageRequest: PageRequestDTO = {
                pageNum: currentPage,
                pageSize: 10,
            };
            const response = await experimentRecordApi.getRecordsByProjectId(project.id, pageRequest);
            if (response.data.code === 200 && response.data.data) {
                setRecords(response.data.data.records || []);
                setTotalPages(response.data.data.pages || 0);
            } else {
                throw new Error(response.data.message || '获取实验记录失败');
            }
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [project.id, enqueueSnackbar]);

    useEffect(() => {
        fetchRecords(page);
    }, [fetchRecords, page]);

    // --- Event Handlers ---
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleOpenCreateForm = () => {
        setIsFormOpen(true);
    };
    const handleCloseForm = () => {
        setIsFormOpen(false);
    };
    const handleCreateRecord = async (dto: ExperimentRecordCreateDTO) => {
        try {
            const response = await experimentRecordApi.createExperimentRecord(dto);
            if (response.data.code === 200 && response.data.data) {
                setRecords(prev => [response.data.data, ...prev]);
                enqueueSnackbar('实验记录创建成功', { variant: 'success' });
            } else {
                throw new Error(response.data.message || '创建失败');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                enqueueSnackbar(error.message || '创建失败', { variant: 'error' });
            } else {
                enqueueSnackbar('创建失败', { variant: 'error' });
            }
        }
    };

    // --- Renderer ---
    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">实验记录</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateForm}>
                        创建新记录
                    </Button>
                </Box>
                <Divider />
                {records.length > 0 ? (
                    <>
                        <List>
                            {records.map((record, index) => (
                                <React.Fragment key={record.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={`记录人: ${record.userId || '未知'}`}
                                            secondary={
                                                <>
                                                    <Typography
                                                        sx={{ display: 'block', whiteSpace: 'pre-wrap', my: 1 }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {record.content}
                                                    </Typography>
                                                    {`记录于: ${record.createdAt ? new Date(record.createdAt).toLocaleString() : '未知时间'}`}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < records.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <Typography sx={{ mt: 3, textAlign: 'center' }} color="text.secondary">
                        该项目下还没有任何实验记录。
                    </Typography>
                )}
            </CardContent>

            {/* TODO: Add RecordForm Dialog here */}
            <RecordForm
                open={isFormOpen}
                onClose={handleCloseForm}
                projectId={typeof project.id === 'number' ? project.id : 0}
                onCreate={handleCreateRecord}
            />
        </Card>
    );
};

export default RecordsTab;
