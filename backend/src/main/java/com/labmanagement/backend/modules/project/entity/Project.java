package com.labmanagement.backend.modules.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 实验项目信息表实体类
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
@TableName("projects")
public class Project implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 项目ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 项目名称
     */
    @TableField("name")
    private String name;

    /**
     * 项目描述
     */
    @TableField("description")
    private String description;

    /**
     * 项目负责人ID
     */
    @TableField("project_lead_id")
    private Long projectLeadId;

    /**
     * 项目状态: 'proposal', 'ongoing', 'completed', 'archived', 'paused'
     */
    @TableField("status")
    private String status;

    /**
     * 计划开始日期
     */
    @TableField("start_date")
    private LocalDate startDate;

    /**
     * 计划结束日期
     */
    @TableField("end_date")
    private LocalDate endDate;

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