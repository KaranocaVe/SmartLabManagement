package com.labmanagement.backend.modules.system.controller;

import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.system.entity.Permission;
import com.labmanagement.backend.modules.system.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 权限管理控制器
 * 提供查询所有权限列表的接口，通常用于前端权限配置页面展示。
 *
 * @author Gemini
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/permissions")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    @GetMapping
    @PreAuthorize("hasAuthority('role:manage')")
    public ApiResponse<List<Permission>> getAllPermissions() {
        return ApiResponse.success(permissionService.list());
    }
}