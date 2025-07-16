package com.labmanagement.backend.modules.system.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.system.dto.AssignPermissionsToRoleDTO;
import com.labmanagement.backend.modules.system.entity.Role;

/**
 * 角色管理 服务类
 *
 * @author Ge
 * @since 2025-07-11
 */
public interface RoleService extends IService<Role> {

    /**
     * 为角色分配权限
     *
     * @param assignPermissionsToRoleDTO 分配权限请求
     */
    void assignPermissionsToRole(AssignPermissionsToRoleDTO assignPermissionsToRoleDTO);
}
