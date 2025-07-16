package com.labmanagement.backend.modules.system.controller;


import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.system.dto.AssignPermissionsToRoleDTO;
import com.labmanagement.backend.modules.system.dto.RoleCreateDTO;
import com.labmanagement.backend.modules.system.entity.Role;
import com.labmanagement.backend.modules.system.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 角色管理控制器
 * 提供对角色的增、删、改、查接口，以及为角色分配权限的接口。
 *
 * @author Ge
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @PostMapping
    @PreAuthorize("hasAuthority('role:manage')") // 假设有一个 'role:manage' 权限
    @AuditLog(description = "创建新角色")
    public ApiResponse<Role> createRole(@Valid @RequestBody RoleCreateDTO roleCreateDTO) {
        Role role = new Role();
        BeanUtils.copyProperties(roleCreateDTO, role);
        roleService.save(role);
        return ApiResponse.success(role);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('role:assign') or hasAuthority('user:view')")
    public ApiResponse<List<Role>> getAllRoles() {
        return ApiResponse.success(roleService.list());
    }

    @PostMapping("/assign-permissions")
    @PreAuthorize("hasAuthority('role:manage')")
    @AuditLog(description = "为角色分配权限")
    public ApiResponse<Void> assignPermissionsToRole(@Valid @RequestBody AssignPermissionsToRoleDTO assignPermissionsToRoleDTO) {
        roleService.assignPermissionsToRole(assignPermissionsToRoleDTO);
        return ApiResponse.success();
    }
}