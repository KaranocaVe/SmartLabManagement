package com.labmanagement.backend.modules.project.controller;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.dto.PageRequestDTO;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.project.dto.AddProjectMemberDTO;
import com.labmanagement.backend.modules.project.dto.ProjectCreateDTO;
import com.labmanagement.backend.modules.project.dto.ProjectUpdateDTO;
import com.labmanagement.backend.modules.project.dto.ProjectVO;
import com.labmanagement.backend.modules.project.entity.Project;
import com.labmanagement.backend.modules.project.entity.ProjectMember;
import com.labmanagement.backend.modules.project.service.ProjectMemberService;
import com.labmanagement.backend.modules.project.service.ProjectService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * 项目管理控制器
 * <p>
 * 核心职责: 管理项目本身，包括项目的增删改查和成员管理。
 * </p>
 *
 * @author Ge
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private static final Logger log = LoggerFactory.getLogger(ProjectController.class);

    private final ProjectService projectService;
    private final ProjectMemberService projectMemberService;

    public ProjectController(ProjectService projectService, ProjectMemberService projectMemberService) {
        this.projectService = projectService;
        this.projectMemberService = projectMemberService;
    }

    /**
     * 创建新项目
     */
    @PostMapping
    @PreAuthorize("hasAuthority('project:create')")
    @AuditLog(description = "创建新项目")
    public ApiResponse<ProjectVO> createProject(@Valid @RequestBody ProjectCreateDTO createDTO) {
        ProjectVO createdProject = projectService.createProject(createDTO);
        return ApiResponse.success(createdProject);
    }

    /**
     * 分页查询项目列表
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()") // 任何认证用户都可以查看项目列表
    public ApiResponse<IPage<ProjectVO>> getProjectPage(@Valid PageRequestDTO pageRequestDTO) {
        // 先分页查询基础项目信息
        IPage<Project> projectPage = projectService.page(new Page<>(pageRequestDTO.getPageNum(), pageRequestDTO.getPageSize()));
        // 将 IPage<Project> 转换为 IPage<ProjectVO> 并填充关联数据
        IPage<ProjectVO> projectVoPage = projectPage.convert(project -> projectService.getProjectDetails(project.getId()));
        return ApiResponse.success(projectVoPage);
    }

    /**
     * 获取单个项目详情
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<ProjectVO> getProjectById(@PathVariable("id") Long id) {
        try {
            ProjectVO projectDetails = projectService.getProjectDetails(id);
            return ApiResponse.success(projectDetails);
        } catch (BusinessException ex) {
            // 仅保留异常日志
            log.error("业务异常: {}", ex.getMessage(), ex);
            return ApiResponse.error(ex.getCode(), ex.getMessage());
        }
    }

    /**
     * 更新项目信息
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('project:edit')")
    @AuditLog(description = "更新项目信息")
    public ApiResponse<ProjectVO> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectUpdateDTO updateDTO) {
        updateDTO.setId(id);
        ProjectVO updatedProject = projectService.updateProject(updateDTO);
        return ApiResponse.success(updatedProject);
    }

    /**
     * 删除项目
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('project:delete')")
    @AuditLog(description = "删除项目")
    public ApiResponse<Void> deleteProject(@PathVariable Long id) {
        // 注意：由于数据库设置了外键，删除项目前可能需要先处理关联的成员、任务等数据
        projectService.removeById(id);
        return ApiResponse.success();
    }

    /**
     * 为项目添加成员
     */
    @PostMapping("/members")
    @PreAuthorize("hasAuthority('project:assign:member')")
    @AuditLog(description = "为项目添加成员")
    public ApiResponse<Void> addMemberToProject(@Valid @RequestBody AddProjectMemberDTO addMemberDTO) {
        projectService.addMember(addMemberDTO);
        return ApiResponse.success();
    }

    /**
     * 从项目中移除成员
     */
    @DeleteMapping("/{projectId}/members/{userId}")
    @PreAuthorize("hasAuthority('project:assign:member')")
    @AuditLog(description = "从项目中移除成员")
    public ApiResponse<Void> removeMemberFromProject(@PathVariable Long projectId, @PathVariable Long userId) {
        projectMemberService.remove(new LambdaQueryWrapper<ProjectMember>()
                .eq(ProjectMember::getProjectId, projectId)
                .eq(ProjectMember::getUserId, userId));
        return ApiResponse.success();
    }
}
