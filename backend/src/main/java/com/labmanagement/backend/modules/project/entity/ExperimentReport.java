package com.labmanagement.backend.modules.project.entity;


import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 实验报告与成果归档表实体类
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
@TableName("experiment_reports")
public class ExperimentReport implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 报告ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 所属项目ID
     */
    @TableField("project_id")
    private Long projectId;

    /**
     * 报告标题
     */
    @TableField("title")
    private String title;

    /**
     * 作者ID
     */
    @TableField("author_id")
    private Long authorId;

    /**
     * 当前版本ID
     */
    @TableField("current_version_id")
    private Long currentVersionId;

    /**
     * 状态: 'draft', 'submitted', 'archived'
     */
    @TableField("status")
    private String status;

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