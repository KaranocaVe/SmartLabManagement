package com.labmanagement.backend.modules.resource.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.labmanagement.backend.modules.resource.entity.ResourceRequest;
import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface ResourceRequestMapper extends BaseMapper<ResourceRequest> {
}