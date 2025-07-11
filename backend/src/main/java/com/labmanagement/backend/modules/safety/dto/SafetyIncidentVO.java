package com.labmanagement.backend.modules.safety.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * View Object for displaying safety incident details.
 * 用于向前端展示安全事故的详细信息，会包含报告人姓名等。
 */
@Data
public class SafetyIncidentVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private Integer labId;
    private String labName; // 关联查询出的实验室名称
    private Long reportedByUserId;
    private String reportedByUserName; // 关联查询出的报告人姓名
    private LocalDateTime incidentTime;
    private String description;
    private String actionsTaken;
    private LocalDateTime createdAt;
}