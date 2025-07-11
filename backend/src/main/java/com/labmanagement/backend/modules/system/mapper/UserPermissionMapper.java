package com.labmanagement.backend.modules.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.labmanagement.backend.modules.system.entity.UserPermission;
import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface UserPermissionMapper extends BaseMapper<UserPermission> {
}