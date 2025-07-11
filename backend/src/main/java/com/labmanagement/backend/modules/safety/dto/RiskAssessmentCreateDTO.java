package com.labmanagement.backend.modules.safety.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for creating a new risk assessment.
 * 用于创建新的风险评估时，封装评估内容。
 */
@Data
public class RiskAssessmentCreateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull(message = "关联的项目ID不能为空")
    private Long projectId;

    @NotBlank(message = "风险等级不能为空")
    private String riskLevel; // 'low', 'medium', 'high', 'critical'

    @NotBlank(message = "已识别风险内容不能为空")
    private String identifiedRisks;

    @NotBlank(message = "防护措施内容不能为空")
    private String protectiveMeasures;

    @NotNull(message = "评估日期不能为空")
    private LocalDate assessmentDate;
}