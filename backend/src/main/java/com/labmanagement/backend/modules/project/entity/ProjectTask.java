package com.labmanagement.backend.modules.project.entity;


import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 实验项目任务分解表实体类
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
@TableName("project_tasks")
public class ProjectTask implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 任务ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 所属项目ID
     */
    @TableField("project_id")
    private Long projectId;

    /**
     * 任务名称
     */
    @TableField("name")
    private String name;

    /**
     * 任务描述
     */
    @TableField("description")
    private String description;

    /**
     * 负责人ID
     */
    @TableField("assigned_to_user_id")
    private Long assignedToUserId;

    /**
     * 任务状态: 't/odo', 'in_progress', 'done', 'blocked'
     */
    @TableField("status")
    private String status;

    /**
     * 截止日期
     */
    @TableField("due_date")
    private LocalDate dueDate;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}