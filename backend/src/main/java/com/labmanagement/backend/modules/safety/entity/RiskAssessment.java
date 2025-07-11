package com.labmanagement.backend.modules.safety.entity;


import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 实验项目风险评估表实体类
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Data
@TableName("risk_assessments")
public class RiskAssessment implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 关联的项目ID
     */
    @TableField("project_id")
    private Long projectId;

    /**
     * 评估人用户ID
     */
    @TableField("assessed_by_user_id")
    private Long assessedByUserId;

    /**
     * 风险等级: 'low', 'medium', 'high', 'critical'
     */
    @TableField("risk_level")
    private String riskLevel;

    /**
     * 已识别的风险
     */
    @TableField("identified_risks")
    private String identifiedRisks;

    /**
     * 防护措施
     */
    @TableField("protective_measures")
    private String protectiveMeasures;

    /**
     * 评估日期
     */
    @TableField("assessment_date")
    private LocalDate assessmentDate;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}