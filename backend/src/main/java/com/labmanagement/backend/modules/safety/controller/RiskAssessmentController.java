package com.labmanagement.backend.modules.safety.controller;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.safety.dto.RiskAssessmentCreateDTO;
import com.labmanagement.backend.modules.safety.dto.RiskAssessmentVO;
import com.labmanagement.backend.modules.safety.entity.RiskAssessment;
import com.labmanagement.backend.modules.safety.service.RiskAssessmentService;
import com.labmanagement.backend.modules.system.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 风险评估控制器
 *
 * @author Ge
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/risk-assessments")
public class RiskAssessmentController {

    @Autowired
    private RiskAssessmentService riskAssessmentService;

    /**
     * 创建新的风险评估
     *
     * @param createDTO   风险评估的创建信息
     * @param currentUser 当前登录用户
     * @return 创建后的风险评估视图对象
     */
    @PostMapping
    @PreAuthorize("hasAuthority('safety:assess')")
    @AuditLog(description = "创建新的风险评估")
    public ApiResponse<RiskAssessmentVO> createAssessment(
            @Valid @RequestBody RiskAssessmentCreateDTO createDTO,
            @AuthenticationPrincipal User currentUser) {

        RiskAssessmentVO createdAssessment = riskAssessmentService.createAssessment(createDTO, currentUser.getId());
        return ApiResponse.success(createdAssessment);
    }

    /**
     * 获取单个风险评估的详情
     *
     * @param id 风险评估ID
     * @return 风险评估的详细视图对象
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<RiskAssessmentVO> getAssessmentById(@PathVariable Long id) {
        RiskAssessmentVO assessmentDetails = riskAssessmentService.getAssessmentDetails(id);
        return ApiResponse.success(assessmentDetails);
    }

    /**
     * 查询指定项目下的所有风险评估
     *
     * @param projectId 项目ID
     * @return 该项目下的风险评估列表
     */
    @GetMapping("/project/{projectId}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<List<RiskAssessmentVO>> getAssessmentsByProjectId(@PathVariable Long projectId) {
        List<RiskAssessment> assessments = riskAssessmentService.list(
                new LambdaQueryWrapper<RiskAssessment>().eq(RiskAssessment::getProjectId, projectId)
        );
        // 转换为VO列表
        List<RiskAssessmentVO> voList = assessments.stream()
                .map(assessment -> riskAssessmentService.getAssessmentDetails(assessment.getId()))
                .collect(Collectors.toList());
        return ApiResponse.success(voList);
    }
}