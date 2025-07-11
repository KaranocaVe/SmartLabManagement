package com.labmanagement.backend.modules.project.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for creating a new project.
 * 用于创建新项目时，封装项目名称、负责人、描述等基础信息。
 */
@Data
public class ProjectCreateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "项目名称不能为空")
    private String name;

    @NotNull(message = "项目负责人ID不能为空")
    private Long projectLeadId;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;
}
