import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    Divider,
    Card,
    CardContent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';

// 导入API和相关类型
import { experimentReportApi } from '../../../../api';
import type { ProjectVO, ExperimentReportVO, ReportVersionCreateDTO,ExperimentReportCreateDTO } from '../../../../client';
// import ReportForm from './ReportForm'; // 理想情况下，表单会是一个独立组件

/**
 * 实验报告标签页
 * @description 管理该项目的实验报告，包括创建新报告和为现有报告创建新版本。
 */
const ReportsTab: React.FC = () => {
    // 假设 project 对象中包含了 reports 列表
    const { project } = useOutletContext<{ project: ProjectVO }>();
    const { enqueueSnackbar } = useSnackbar();

    // --- State Management ---
    const [reports, setReports] = useState<ExperimentReportVO[]>([]);
    // const [isFormOpen, setIsFormOpen] = useState(false);

    // 从项目数据初始化报告列表
    useEffect(() => {
        // 假设 project.reports 存在。如果不存在，则需要一个API来获取。
        if (project.reports) {
            setReports(project.reports);
        }
    }, [project]);


    // --- Event Handlers ---
    const handleOpenCreateReportForm = () => {
        enqueueSnackbar('创建新报告功能待实现', { variant: 'info' });
        // setIsFormOpen(true);
    };

    const handleOpenNewVersionForm = (reportId: number) => {
        enqueueSnackbar(`为报告 ${reportId} 创建新版本功能待实现`, { variant: 'info' });
        // Logic to open a form dialog for creating a new version
    };

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">实验报告</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateReportForm}>
                        创建新报告
                    </Button>
                </Box>
                <Divider />

                {reports.length > 0 ? (
                    <Box sx={{ mt: 2 }}>
                        {reports.map((report) => (
                            <Accordion key={report.id}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`report-${report.id}-content`}
                                    id={`report-${report.id}-header`}
                                >
                                    <Typography sx={{ width: '70%', flexShrink: 0 }}>
                                        {report.title}
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>
                                        最新版本: v{report.versions?.length || 0}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                        <Button size="small" onClick={() => handleOpenNewVersionForm(report.id)}>创建新版本</Button>
                                    </Box>
                                    <List dense>
                                        {report.versions?.map((version: ReportVersion, index: number) => (
                                            <React.Fragment key={version.id}>
                                                <ListItem>
                                                    <ListItemText
                                                        primary={`v${version.versionNumber} - 由 ${version.creatorName} 创建`}
                                                        secondary={`创建于: ${new Date(version.createTime).toLocaleString()}`}
                                                    />
                                                </ListItem>
                                                {index < report.versions.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                ) : (
                    <Typography sx={{ mt: 3, textAlign: 'center' }} color="text.secondary">
                        该项目下还没有任何实验报告。
                    </Typography>
                )}
            </CardContent>

            {/* TODO: Add ReportForm Dialog here */}
        </Card>
    );
};

export default ReportsTab;
