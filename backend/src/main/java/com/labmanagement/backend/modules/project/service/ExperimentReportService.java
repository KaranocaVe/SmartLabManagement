package com.labmanagement.backend.modules.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.project.dto.ExperimentReportCreateDTO;
import com.labmanagement.backend.modules.project.dto.ExperimentReportVO;
import com.labmanagement.backend.modules.project.entity.ExperimentReport;

/**
 * Service for ExperimentReport.
 * 封装实验报告及其版本管理的逻辑。
 *
 * @author Gemini
 * @since 2025-07-12
 */
public interface ExperimentReportService extends IService<ExperimentReport> {
    ExperimentReportVO createReport(ExperimentReportCreateDTO createDTO, Long authorId);

    ExperimentReportVO createNewVersion(Long reportId, String newContent, Long modifierId);

    ExperimentReportVO getReportDetails(Long reportId);
}
