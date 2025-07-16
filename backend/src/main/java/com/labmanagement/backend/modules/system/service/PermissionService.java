package com.labmanagement.backend.modules.system.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.system.entity.Permission;


/**
 * 权限管理 服务类
 *
 * @author Ge
 * @since 2025-07-11
 */
public interface PermissionService extends IService<Permission> {
    // 目前权限服务主要提供基础的CRUD，由 IService 实现
    // 未来可根据需求扩展，如：按模块分组获取权限树等
}