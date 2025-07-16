package com.labmanagement.backend.modules.system.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.modules.system.dto.AssignPermissionsToRoleDTO;
import com.labmanagement.backend.modules.system.entity.Role;
import com.labmanagement.backend.modules.system.entity.RolePermission;
import com.labmanagement.backend.modules.system.mapper.RoleMapper;
import com.labmanagement.backend.modules.system.service.RolePermissionService;
import com.labmanagement.backend.modules.system.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 角色管理 服务实现类
 *
 * @author Ge
 * @since 2025-07-11
 */
@Service
public class RoleServiceImpl extends ServiceImpl<RoleMapper, Role> implements RoleService {

    @Autowired
    private RolePermissionService rolePermissionService;

    @Override
    @Transactional
    public void assignPermissionsToRole(AssignPermissionsToRoleDTO assignPermissionsToRoleDTO) {
        Integer roleId = assignPermissionsToRoleDTO.getRoleId();
        // 1. 删除角色原有的所有权限关联
        rolePermissionService.remove(new LambdaQueryWrapper<RolePermission>().eq(RolePermission::getRoleId, roleId));

        // 2. 添加新的权限关联
        List<Integer> permissionIds = assignPermissionsToRoleDTO.getPermissionIds();
        if (!CollectionUtils.isEmpty(permissionIds)) {
            List<RolePermission> rolePermissions = permissionIds.stream()
                    .map(permissionId -> new RolePermission(roleId, permissionId))
                    .collect(Collectors.toList());
            // 批量插入
            rolePermissionService.saveBatch(rolePermissions);
        }
    }
}