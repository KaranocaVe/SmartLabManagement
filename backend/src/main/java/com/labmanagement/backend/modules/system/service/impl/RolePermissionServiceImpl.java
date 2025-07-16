package com.labmanagement.backend.modules.system.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.modules.system.entity.RolePermission;
import com.labmanagement.backend.modules.system.mapper.RolePermissionMapper;
import com.labmanagement.backend.modules.system.service.RolePermissionService;
import org.springframework.stereotype.Service;

/**
 * 角色权限关联 服务实现类
 *
 * @author Ge
 * @since 2025-07-11
 */
@Service
public class RolePermissionServiceImpl extends ServiceImpl<RolePermissionMapper, RolePermission> implements RolePermissionService {
}