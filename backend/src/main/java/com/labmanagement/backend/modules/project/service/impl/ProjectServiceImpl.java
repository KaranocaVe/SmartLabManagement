package com.labmanagement.backend.modules.project.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.common.enums.ResponseCode;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.modules.project.dto.*;
import com.labmanagement.backend.modules.project.entity.Project;
import com.labmanagement.backend.modules.project.entity.ProjectMember;
import com.labmanagement.backend.modules.project.mapper.ProjectMapper;
import com.labmanagement.backend.modules.project.service.ProjectMemberService;
import com.labmanagement.backend.modules.project.service.ProjectService;
import com.labmanagement.backend.modules.system.entity.User;
import com.labmanagement.backend.modules.system.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Implementation of ProjectService.
 *
 * @author Gemini
 * @since 2025-07-12
 */
@Service
public class ProjectServiceImpl extends ServiceImpl<ProjectMapper, Project> implements ProjectService {

private static final Logger logger = LoggerFactory.getLogger(ProjectServiceImpl.class);

    private final UserService userService;
    private final ProjectMemberService projectMemberService;

    public ProjectServiceImpl(UserService userService, ProjectMemberService projectMemberService) {
        this.userService = userService;
        this.projectMemberService = projectMemberService;
    }

    @Override
    @Transactional
    public ProjectVO createProject(ProjectCreateDTO createDTO) {
        // 1. 校验项目负责人是否存在
        User lead = userService.getById(createDTO.getProjectLeadId());
        if (lead == null) {
            throw new BusinessException(ResponseCode.PROJECT_LEAD_NOT_FOUND);
        }

        // 2. 手动设置 Project 实体字段
        Project project = new Project();
        project.setName(createDTO.getName());
        project.setDescription(createDTO.getDescription());
        project.setStatus("proposal"); // 初始状态为“提议”
        project.setStartDate(createDTO.getStartDate());
        project.setEndDate(createDTO.getEndDate());
        project.setProjectLeadId(createDTO.getProjectLeadId());
        this.save(project);

        // 3. 自动将项目负责人添加为项目成员
        ProjectMember leadAsMember = new ProjectMember(project.getId(), lead.getId(), "负责人");
        projectMemberService.save(leadAsMember);

        return getProjectDetails(project.getId());
    }

    @Override
    @Transactional
    public ProjectVO updateProject(ProjectUpdateDTO updateDTO) {
        Project project = this.getById(updateDTO.getId());
        if (project == null) {
            logger.warn("Project not found, id={}" , updateDTO.getId());
            throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "要更新的项目不存在");
        }

        // 手动更新 Project 实体字段
        project.setName(updateDTO.getName());
        project.setDescription(updateDTO.getDescription());
        project.setStatus(updateDTO.getStatus());
        project.setStartDate(updateDTO.getStartDate());
        project.setEndDate(updateDTO.getEndDate());
        this.updateById(project);

        return getProjectDetails(project.getId());
    }

    @Override
    @Transactional
    public void addMember(AddProjectMemberDTO addMemberDTO) {
        Project project = this.getById(addMemberDTO.getProjectId());
        User user = userService.getById(addMemberDTO.getUserId());
        if (project == null) {
            logger.warn("Project not found, id={}" , addMemberDTO.getProjectId());
            throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "项目不存在");
        }
        if (user == null) {
            logger.warn("User not found, id={}" , addMemberDTO.getUserId());
            throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "用户不存在");
        }

        // 1. 构造查询条件
        LambdaQueryWrapper<ProjectMember> queryWrapper = new LambdaQueryWrapper<ProjectMember>()
                .eq(ProjectMember::getProjectId, addMemberDTO.getProjectId())
                .eq(ProjectMember::getUserId, addMemberDTO.getUserId());

        // 2. 尝试获取已存在的记录
        ProjectMember existingMember = projectMemberService.getOne(queryWrapper);

        if (existingMember != null) {
            // 3. 如果已存在，只更新角色
            existingMember.setRoleInProject(addMemberDTO.getRoleInProject());
            projectMemberService.update(existingMember, queryWrapper);
        } else {
            // 4. 如果不存在，手动创建新记录并保存
            ProjectMember newMember = new ProjectMember();
            newMember.setProjectId(addMemberDTO.getProjectId());
            newMember.setUserId(addMemberDTO.getUserId());
            newMember.setRoleInProject(addMemberDTO.getRoleInProject());
            projectMemberService.save(newMember);
        }
    }

    @Override
    public ProjectVO getProjectDetails(Long projectId) {
        try {
            // 1. 获取项目基本信息
            Project project = this.getById(projectId);
            if (project == null) {
                logger.warn("Project not found, id={}", projectId);
                throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "项目不存在");
            }

            // 2. 手动设置 ProjectVO 的字段
            ProjectVO projectVO = new ProjectVO();
            projectVO.setId(project.getId());
            projectVO.setName(project.getName());
            projectVO.setDescription(project.getDescription());
            projectVO.setStatus(project.getStatus());
            projectVO.setStartDate(project.getStartDate());
            projectVO.setEndDate(project.getEndDate());

            // 3. 获取并设置项目负责人信息
            User lead = userService.getById(project.getProjectLeadId());
            if (lead != null) {
                projectVO.setProjectLeadName(lead.getUsername());
            } else {
                logger.warn("Project lead not found, id={}", project.getProjectLeadId());
                projectVO.setProjectLeadName("");
            }

            // 4. 获取并设置项目成员列表
            List<ProjectMember> members = projectMemberService.list(
                    new LambdaQueryWrapper<ProjectMember>().eq(ProjectMember::getProjectId, projectId)
            );

            if (members != null && !members.isEmpty()) {
                List<ProjectMemberVO> memberVOs = members.stream().map(member -> {
                    ProjectMemberVO memberVO = new ProjectMemberVO();
                    memberVO.setUserId(member.getUserId());
                    memberVO.setRoleInProject(member.getRoleInProject());
                    User memberUser = userService.getById(member.getUserId());
                    if (memberUser != null) {
                        memberVO.setMemberName(memberUser.getUsername());
                    } else {
                        logger.warn("Project member user not found, userId={}", member.getUserId());
                        memberVO.setMemberName("未知成员");
                    }
                    return memberVO;
                }).toList();
                projectVO.setMembers(memberVOs);
            } else {
                projectVO.setMembers(Collections.emptyList());
            }
            return projectVO;
        } catch (Exception e) {
            logger.error("Error in getProjectDetails, projectId={}, exception={}", projectId, e.getMessage(), e);
            throw new BusinessException(ResponseCode.DATABASE_ERROR.getCode(), "获取项目详情时发生异常: " + e.getMessage());
        }
    }
}
