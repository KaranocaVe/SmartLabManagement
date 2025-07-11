package com.labmanagement.backend.modules.log.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.log.dto.AuditLogQueryDTO;
import com.labmanagement.backend.modules.log.dto.AuditLogVO;
import com.labmanagement.backend.modules.log.entity.AuditLog;

/**
 * Service for logging and auditing.
 * 封装查询审计日志的业务逻辑，并提供一个内部方法用于保存新的审计日志记录。
 *
 * @author Gemini
 * @since 2025-07-12
 */
public interface LogService extends IService<AuditLog> {

    /**
     * Queries audit logs with pagination and filters.
     * 根据查询条件分页查询审计日志。
     *
     * @param queryDTO The DTO containing query parameters.
     * @return A paginated list of audit log view objects.
     */
    IPage<AuditLogVO> queryAuditLogs(AuditLogQueryDTO queryDTO);

}