package com.labmanagement.backend.modules.log.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * View Object for displaying audit log details.
 * 用于向前端展示审计日志的详细信息，会包含操作人姓名等关联信息。
 */
@Data
public class AuditLogVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long userId;
    private String userName; // 关联查询出的操作人姓名
    private String action;
    private String targetType;
    private Long targetId;
    private String details; // JSON 格式的详情
    private String ipAddress;
    private LocalDateTime createdAt;
}