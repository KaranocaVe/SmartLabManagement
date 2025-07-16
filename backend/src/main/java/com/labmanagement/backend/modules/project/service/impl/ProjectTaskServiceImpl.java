package com.labmanagement.backend.modules.project.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.modules.project.entity.ProjectTask;
import com.labmanagement.backend.modules.project.mapper.ProjectTaskMapper;
import com.labmanagement.backend.modules.project.service.ProjectTaskService;
import org.springframework.stereotype.Service;

/**
 * Implementation of ProjectTaskService.
 *
 * @author Ge
 * @since 2025-07-12
 */
@Service
public class ProjectTaskServiceImpl extends ServiceImpl<ProjectTaskMapper, ProjectTask> implements ProjectTaskService {
}
