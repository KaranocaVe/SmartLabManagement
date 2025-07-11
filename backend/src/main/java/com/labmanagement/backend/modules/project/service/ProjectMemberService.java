package com.labmanagement.backend.modules.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.project.entity.ProjectMember;

/**
 * Service for ProjectMember.
 * 专门管理 `project_members` 这张中间表，处理项目成员的增、删、改、查。
 *
 * @author Gemini
 * @since 2025-07-12
 */
public interface ProjectMemberService extends IService<ProjectMember> {
}