package com.labmanagement.backend.modules.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for updating an existing project.
 * 用于更新项目信息时，封装可修改的字段。
 */
@Data
public class ProjectUpdateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull(message = "项目ID不能为空")
    private Long id;

    private String name;
    private String description;
    private Long projectLeadId;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
}