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
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';

// 导入API和相关类型
import { riskAssessmentApi } from '../../../../api';
import type { ProjectVO, RiskAssessmentVO } from '../../../../client';
// import RiskAssessmentForm from './RiskAssessmentForm'; // 理想情况下，表单会是一个独立组件

/**
 * 风险评估标签页
 * @description 展示该项目的所有风险评估记录。
 */
const RiskAssessmentsTab: React.FC = () => {
    const { project } = useOutletContext<{ project: ProjectVO }>();
    const { enqueueSnackbar } = useSnackbar();

    // --- State Management ---
    const [assessments, setAssessments] = useState<RiskAssessmentVO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // const [isFormOpen, setIsFormOpen] = useState(false);

    // --- Data Fetching ---
    const fetchAssessments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await riskAssessmentApi.getAssessmentsByProjectId(project.id);
            if (response.data.code === 200 && response.data.data) {
                setAssessments(response.data.data);
            } else {
                throw new Error(response.data.message || '获取风险评估列表失败');
            }
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [project.id, enqueueSnackbar]);

    useEffect(() => {
        fetchAssessments();
    }, [fetchAssessments]);

    // --- Event Handlers ---
    const handleOpenCreateForm = () => {
        enqueueSnackbar('创建风险评估功能待实现', { variant: 'info' });
        // setIsFormOpen(true);
    };

    const getRiskLevelChipColor = (level: string) => {
        switch (level?.toUpperCase()) {
            case 'HIGH':
            case '高':
                return 'error';
            case 'MEDIUM':
            case '中':
                return 'warning';
            case 'LOW':
            case '低':
                return 'success';
            default:
                return 'default';
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
                    <Typography variant="h6">风险评估记录</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateForm}>
                        创建新评估
                    </Button>
                </Box>
                <Divider />
                {assessments.length > 0 ? (
                    <List>
                        {assessments.map((assessment, index) => (
                            <React.Fragment key={assessment.id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Typography component="span" variant="body1" fontWeight="bold">
                                                    评估日期: {new Date(assessment.assessmentDate).toLocaleDateString()}
                                                </Typography>
                                                <Chip
                                                    label={`风险等级: ${assessment.riskLevel}`}
                                                    color={getRiskLevelChipColor(assessment.riskLevel)}
                                                    size="small"
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Typography sx={{ mt: 1 }} component="div" variant="subtitle2">已识别风险:</Typography>
                                                <Typography sx={{ whiteSpace: 'pre-wrap' }} component="p" variant="body2" color="text.secondary">
                                                    {assessment.identifiedRisks}
                                                </Typography>
                                                <Typography sx={{ mt: 1 }} component="div" variant="subtitle2">防护措施:</Typography>
                                                <Typography sx={{ whiteSpace: 'pre-wrap' }} component="p" variant="body2" color="text.secondary">
                                                    {assessment.protectiveMeasures}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                {index < assessments.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Typography sx={{ mt: 3, textAlign: 'center' }} color="text.secondary">
                        该项目下还没有任何风险评估记录。
                    </Typography>
                )}
            </CardContent>

            {/* TODO: Add RiskAssessmentForm Dialog here */}
        </Card>
    );
};

export default RiskAssessmentsTab;
