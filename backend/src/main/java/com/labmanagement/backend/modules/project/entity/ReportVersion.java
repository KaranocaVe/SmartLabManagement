package com.labmanagement.backend.modules.project.entity;


import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 报告版本历史表实体类
 *
 * @author Ge
 * @since 2025-07-12
 */
@Data
@TableName("report_versions")
public class ReportVersion implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("report_id")
    private Long reportId;

    @TableField("version_number")
    private String versionNumber;

    @TableField("content")
    private String content;

    @TableField("modifier_id")
    private Long modifierId;

    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
