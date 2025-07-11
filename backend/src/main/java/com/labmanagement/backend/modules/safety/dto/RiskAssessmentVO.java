package com.labmanagement.backend.modules.safety.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * View Object for displaying risk assessment details.
 * 用于向前端展示风险评估的详细信息，会包含评估人姓名等。
 */
@Data
public class RiskAssessmentVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long projectId;
    private Long assessedByUserId;
    private String assessedByUserName; // 关联查询出的评估人姓名
    private String riskLevel;
    private String identifiedRisks;
    private String protectiveMeasures;
    private LocalDate assessmentDate;
    private LocalDateTime createdAt;
}
