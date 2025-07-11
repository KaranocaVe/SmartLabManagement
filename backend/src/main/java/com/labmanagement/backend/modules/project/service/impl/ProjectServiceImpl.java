package com.labmanagement.backend.modules.project.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.common.enums.ResponseCode;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.common.utils.BeanCopyUtil;
import com.labmanagement.backend.modules.project.dto.*;
import com.labmanagement.backend.modules.project.entity.Project;
import com.labmanagement.backend.modules.project.entity.ProjectMember;
import com.labmanagement.backend.modules.project.mapper.ProjectMapper;
import com.labmanagement.backend.modules.project.service.ProjectMemberService;
import com.labmanagement.backend.modules.project.service.ProjectService;
import com.labmanagement.backend.modules.system.entity.User;
import com.labmanagement.backend.modules.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


/**
 * Implementation of ProjectService.
 *
 * @author Gemini
 * @since 2025-07-12
 */
@Service
public class ProjectServiceImpl extends ServiceImpl<ProjectMapper, Project> implements ProjectService {

    @Autowired
    private UserService userService;

    @Autowired
    private ProjectMemberService projectMemberService;

    @Override
    @Transactional
    public ProjectVO createProject(ProjectCreateDTO createDTO) {
        // 1. 校验项目负责人是否存在
        User lead = userService.getById(createDTO.getProjectLeadId());
        if (lead == null) {
            throw new BusinessException(ResponseCode.PROJECT_LEAD_NOT_FOUND);
        }

        // 2. 转换并保存项目实体
        Project project = BeanCopyUtil.copyProperties(createDTO, Project.class);
        project.setStatus("proposal"); // 初始状态为“提议”
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
            throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "要更新的项目不存在");
        }
        BeanCopyUtil.copyProperties(updateDTO, project);
        this.updateById(project);
        return getProjectDetails(project.getId());
    }

    @Override
    @Transactional
    public void addMember(AddProjectMemberDTO addMemberDTO) {
        // 校验项目和用户是否存在
        if (this.getById(addMemberDTO.getProjectId()) == null || userService.getById(addMemberDTO.getUserId()) == null) {
            throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "项目或用户不存在");
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
            // 使用 update(entity, wrapper) 来更新
            projectMemberService.update(existingMember, queryWrapper);
        } else {
            // 4. 如果不存在，创建新记录并保存
            ProjectMember newMember = BeanCopyUtil.copyProperties(addMemberDTO, ProjectMember.class);
            projectMemberService.save(newMember);
        }
    }

    @Override
    public ProjectVO getProjectDetails(Long projectId) {
        Project project = this.getById(projectId);
        if (project == null) {
            return null;
        }

        ProjectVO vo = BeanCopyUtil.copyProperties(project, ProjectVO.class);

        // 1. 设置项目负责人姓名
        User lead = userService.getById(project.getProjectLeadId());
        if (lead != null) {
            vo.setProjectLeadName(lead.getRealName());
        }

        // 2. 设置项目成员列表
        List<ProjectMember> members = projectMemberService.list(new LambdaQueryWrapper<ProjectMember>()
                .eq(ProjectMember::getProjectId, projectId));
        if (!members.isEmpty()) {
            List<Long> userIds = members.stream().map(ProjectMember::getUserId).collect(Collectors.toList());
            List<User> users = userService.listByIds(userIds);

            List<ProjectMemberVO> memberVOs = members.stream().map(member -> {
                ProjectMemberVO memberVO = new ProjectMemberVO();
                memberVO.setUserId(member.getUserId());
                memberVO.setRoleInProject(member.getRoleInProject());
                users.stream()
                        .filter(u -> u.getId().equals(member.getUserId()))
                        .findFirst()
                        .ifPresent(u -> memberVO.setRealName(u.getRealName()));
                return memberVO;
            }).collect(Collectors.toList());
            vo.setMembers(memberVOs);
        } else {
            vo.setMembers(Collections.emptyList());
        }

        return vo;
    }
}