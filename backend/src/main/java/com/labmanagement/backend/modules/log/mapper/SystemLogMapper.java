package com.labmanagement.backend.modules.log.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.labmanagement.backend.modules.log.entity.SystemLog;
import org.apache.ibatis.annotations.Mapper;

/**
 * 系统运行日志表 Mapper 接口
 * <p>
 * 通过继承 BaseMapper，该接口自动拥有了对 SystemLog 实体的常用 CRUD（增删改查）方法。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Mapper
public interface SystemLogMapper extends BaseMapper<SystemLog> {

    // 复杂的系统日志查询（如按级别和时间范围统计）可以在此定义，并在 XML 中实现。

}