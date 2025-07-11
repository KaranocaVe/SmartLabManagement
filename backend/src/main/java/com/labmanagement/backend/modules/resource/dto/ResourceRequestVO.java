package com.labmanagement.backend.modules.resource.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * View Object for displaying resource request details.
 * 用于向前端展示资源申请的详细信息，会包含申请人、审批人、资源名称等关联信息。
 */
@Data
public class ResourceRequestVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long userId;
    private String applicantName; // 申请人姓名
    private String requestType;
    private Long resourceId;
    private String resourceName; // 资源名称
    private BigDecimal quantity;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private String status;
    private Long approverId;
    private String approverName; // 审批人姓名
    private String approvalNotes;
    private LocalDateTime createdAt;
}