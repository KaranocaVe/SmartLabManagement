package com.labmanagement.backend.modules.log.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.log.dto.AuditLogQueryDTO;
import com.labmanagement.backend.modules.log.dto.AuditLogVO;
import com.labmanagement.backend.modules.log.service.LogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 日志管理控制器
 * <p>
 * 核心职责: 提供审计日志的分页条件查询接口。
 * </p>
 *
 * @author Ge
 * @since 2025-07-13
 */
@RestController
@RequestMapping("/api/v1/logs")
public class LogController {

    @Autowired
    private LogService logService;

    /**
     * 分页查询审计日志
     * <p>
     * 只有拥有 'log:view' 权限的用户才能访问此接口。
     * </p>
     *
     * @param queryDTO 包含分页和筛选条件的查询对象
     * @return 分页的审计日志列表
     */
    @GetMapping("/audit")
    @PreAuthorize("hasAuthority('log:view')") // 假设有 'log:view' 权限
    public ApiResponse<IPage<AuditLogVO>> getAuditLogs(@Valid AuditLogQueryDTO queryDTO) {
        IPage<AuditLogVO> page = logService.queryAuditLogs(queryDTO);
        return ApiResponse.success(page);
    }
}
