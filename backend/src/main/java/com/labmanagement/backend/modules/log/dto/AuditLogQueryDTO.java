package com.labmanagement.backend.modules.log.dto;


import com.labmanagement.backend.common.dto.PageRequestDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for querying audit logs with filter conditions.
 * 用于前端查询审计日志时，封装筛选条件，如用户ID、操作类型、日期范围等。
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AuditLogQueryDTO extends PageRequestDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 操作用户ID
     */
    private Long userId;

    /**
     * 执行的动作描述
     */
    private String action;

    /**
     * 操作目标的类型
     */
    private String targetType;

    /**
     * 查询起始时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    /**
     * 查询结束时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;
}
