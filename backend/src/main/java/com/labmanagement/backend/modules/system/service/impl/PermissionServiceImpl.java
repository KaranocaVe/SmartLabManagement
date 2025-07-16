package com.labmanagement.backend.modules.system.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.modules.system.entity.Permission;
import com.labmanagement.backend.modules.system.mapper.PermissionMapper;
import com.labmanagement.backend.modules.system.service.PermissionService;
import org.springframework.stereotype.Service;

/**
 * 权限管理 服务实现类
 *
 * @author Ge
 * @since 2025-07-11
 */
@Service
public class PermissionServiceImpl extends ServiceImpl<PermissionMapper, Permission> implements PermissionService {
}