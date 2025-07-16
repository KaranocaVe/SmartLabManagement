package com.labmanagement.backend.modules.project.entity;


import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 实验过程记录表实体类
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
@TableName("experiment_records")
public class ExperimentRecord implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 记录ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 所属项目ID
     */
    @TableField("project_id")
    private Long projectId;

    /**
     * 关联任务ID
     */
    @TableField("task_id")
    private Long taskId;

    /**
     * 记录人ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 实验过程、原始数据等内容
     */
    @TableField("content")
    private String content;

    /**
     * 结构化数据 (以JSON字符串形式存储)
     */
    @TableField("structured_data")
    private String structuredData;

    /**
     * 实验记录的发生时间
     */
    @TableField("record_time")
    private LocalDateTime recordTime;

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