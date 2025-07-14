package com.labmanagement.backend.modules.project.controller;


import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.project.dto.ExperimentReportCreateDTO;
import com.labmanagement.backend.modules.project.dto.ExperimentReportVO;
import com.labmanagement.backend.modules.project.dto.ReportVersionCreateDTO;
import com.labmanagement.backend.modules.project.service.ExperimentReportService;
import com.labmanagement.backend.modules.system.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 实验报告管理控制器
 * <p>
 * 核心职责: 管理实验报告的创建、版本更新和查询。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-13
 */
@RestController
@RequestMapping("/api/v1/experiment-reports")
public class ExperimentReportController {

    @Autowired
    private ExperimentReportService experimentReportService;

    /**
     * 创建一份新的实验报告（包含初版内容）
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @AuditLog(description = "创建新的实验报告")
    public ApiResponse<ExperimentReportVO> createReport(
            @Valid @RequestBody ExperimentReportCreateDTO createDTO,
            @AuthenticationPrincipal User currentUser) {

        ExperimentReportVO report = experimentReportService.createReport(createDTO, currentUser.getId());
        return ApiResponse.success(report);
    }

    /**
     * 获取指定ID的实验报告详情（包含当前版本内容）
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<ExperimentReportVO> getReportById(@PathVariable Long id) {
        ExperimentReportVO reportDetails = experimentReportService.getReportDetails(id);
        return ApiResponse.success(reportDetails);
    }

    /**
     * 为指定的实验报告创建一个新版本
     */
    @PutMapping("/{id}/versions")
    @PreAuthorize("isAuthenticated()")
    @AuditLog(description = "更新实验报告版本")
    public ApiResponse<ExperimentReportVO> createNewVersion(
            @PathVariable Long id,
            @Valid @RequestBody ReportVersionCreateDTO versionDTO,
            @AuthenticationPrincipal User currentUser) {

        ExperimentReportVO updatedReport = experimentReportService.createNewVersion(id, versionDTO.getContent(), currentUser.getId());
        return ApiResponse.success(updatedReport);
    }
}