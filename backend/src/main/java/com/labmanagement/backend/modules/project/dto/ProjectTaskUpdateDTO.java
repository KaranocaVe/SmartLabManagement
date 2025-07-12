package com.labmanagement.backend.modules.project.dto;


import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for updating an existing project task.
 * 用于更新项目任务时，封装可修改的字段。
 */
@Data
public class ProjectTaskUpdateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String name;

    private String description;

    private Long assignedToUserId;

    private String status; // 't-odo', 'in_progress', 'done', 'blocked'

    private LocalDate dueDate;
}
