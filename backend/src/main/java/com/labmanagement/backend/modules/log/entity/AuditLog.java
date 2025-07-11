package com.labmanagement.backend.modules.log.entity;


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
 * 用户操作审计日志表实体类
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Data
@TableName("audit_logs")
public class AuditLog implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 操作用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 执行的动作描述
     */
    @TableField("action")
    private String action;

    /**
     * 操作目标的类型
     */
    @TableField("target_type")
    private String targetType;

    /**
     * 操作目标的ID
     */
    @TableField("target_id")
    private Long targetId;

    /**
     * 操作详情 (以JSON字符串形式存储)
     */
    @TableField("details")
    private String details;

    /**
     * 操作者IP地址
     */
    @TableField("ip_address")
    private String ipAddress;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
