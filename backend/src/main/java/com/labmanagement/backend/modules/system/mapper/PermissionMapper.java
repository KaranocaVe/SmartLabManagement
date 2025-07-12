package com.labmanagement.backend.modules.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.labmanagement.backend.modules.system.entity.Permission;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PermissionMapper extends BaseMapper<Permission> {
    /**
     * 根据用户ID查询权限编码
     *
     * @param userId 用户ID
     * @return 权限编码列表
     */
    List<String> findPermissionCodesByUserId(Long userId);
}
