package com.labmanagement.backend.modules.safety.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for reporting a new safety incident.
 * 用于上报新的安全事故时，封装事故信息。
 */
@Data
public class SafetyIncidentCreateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Integer labId; // 发生事故的实验室ID，可选

    @NotNull(message = "事故发生时间不能为空")
    private LocalDateTime incidentTime;

    @NotBlank(message = "事故描述不能为空")
    private String description;

    private String actionsTaken; // 采取的措施，可选
}