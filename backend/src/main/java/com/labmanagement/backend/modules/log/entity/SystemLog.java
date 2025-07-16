package com.labmanagement.backend.modules.log.entity;


import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 系统运行日志表实体类
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
@TableName("system_logs")
public class SystemLog implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 日志级别: 'INFO', 'DEBUG', 'WARN', 'ERROR', 'FATAL'
     */
    @TableField("level")
    private String level;

    /**
     * 日志来源 (例如: 类名)
     */
    @TableField("source")
    private String source;

    /**
     * 日志消息
     */
    @TableField("message")
    private String message;

    /**
     * 异常堆栈信息
     */
    @TableField("stack_trace")
    private String stackTrace;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
