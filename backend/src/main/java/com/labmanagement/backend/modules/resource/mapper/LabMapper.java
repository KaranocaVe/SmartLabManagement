package com.labmanagement.backend.modules.resource.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.labmanagement.backend.modules.resource.entity.Lab;
import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface LabMapper extends BaseMapper<Lab> {
}
