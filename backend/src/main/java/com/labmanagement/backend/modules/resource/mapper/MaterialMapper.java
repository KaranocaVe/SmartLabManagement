package com.labmanagement.backend.modules.resource.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.labmanagement.backend.modules.resource.entity.Material;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MaterialMapper extends BaseMapper<Material> {
}
