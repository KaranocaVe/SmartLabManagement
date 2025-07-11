package com.labmanagement.backend.modules.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.labmanagement.backend.modules.project.entity.ProjectTask;
import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface ProjectTaskMapper extends BaseMapper<ProjectTask> {
}