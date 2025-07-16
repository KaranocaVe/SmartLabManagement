package com.labmanagement.backend.modules.system.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.modules.system.entity.UserRole;
import com.labmanagement.backend.modules.system.mapper.UserRoleMapper;
import com.labmanagement.backend.modules.system.service.UserRoleService;
import org.springframework.stereotype.Service;

/**
 * 用户角色关联 服务实现类
 *
 * @author Ge
 * @since 2025-07-11
 */
@Service
public class UserRoleServiceImpl extends ServiceImpl<UserRoleMapper, UserRole> implements UserRoleService {
}