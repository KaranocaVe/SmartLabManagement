package com.labmanagement.backend.modules.project.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.modules.project.entity.ProjectMember;
import com.labmanagement.backend.modules.project.mapper.ProjectMemberMapper;
import com.labmanagement.backend.modules.project.service.ProjectMemberService;
import org.springframework.stereotype.Service;

/**
 * Implementation of ProjectMemberService.
 *
 * @author Ge
 * @since 2025-07-12
 */
@Service
public class ProjectMemberServiceImpl extends ServiceImpl<ProjectMemberMapper, ProjectMember> implements ProjectMemberService {
}
