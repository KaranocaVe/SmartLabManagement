package com.labmanagement.backend.modules.safety.entity;


import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 安全事故记录与分析表实体类
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Data
@TableName("safety_incidents")
public class SafetyIncident implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 发生事故的实验室ID
     */
    @TableField("lab_id")
    private Integer labId;

    /**
     * 报告人用户ID
     */
    @TableField("reported_by_user_id")
    private Long reportedByUserId;

    /**
     * 事故发生时间
     */
    @TableField("incident_time")
    private LocalDateTime incidentTime;

    /**
     * 事故描述
     */
    @TableField("description")
    private String description;

    /**
     * 采取的措施
     */
    @TableField("actions_taken")
    private String actionsTaken;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
