package com.labmanagement.backend.modules.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.labmanagement.backend.modules.system.entity.Permission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 权限表 Mapper 接口
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Mapper
public interface PermissionMapper extends BaseMapper<Permission> {

    /**
     * 根据用户ID查询其拥有的所有权限码。
     * <p>
     * 这个方法会合并用户通过角色继承的权限和被直接授予的临时权限。
     * </p>
     *
     * @param userId 用户ID
     * @return 该用户的所有权限码字符串列表
     */
    List<String> findPermissionCodesByUserId(@Param("userId") Long userId);

}