package com.labmanagement.backend.modules.log.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.labmanagement.backend.modules.log.entity.AuditLog;
import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface AuditLogMapper extends BaseMapper<AuditLog> {

}