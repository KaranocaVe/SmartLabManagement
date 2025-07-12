package com.labmanagement.backend.modules.project.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for creating a new project task.
 * 用于创建新项目任务时，封装任务信息。
 */
@Data
public class ProjectTaskCreateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull(message = "所属项目ID不能为空")
    private Long projectId;

    @NotBlank(message = "任务名称不能为空")
    private String name;

    private String description;

    // 指派给某个用户，可选
    private Long assignedToUserId;

    // 截止日期，可选
    private LocalDate dueDate;
}
