package com.labmanagement.backend.modules.project.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.project.dto.AddProjectMemberDTO;
import com.labmanagement.backend.modules.project.dto.ProjectCreateDTO;
import com.labmanagement.backend.modules.project.dto.ProjectUpdateDTO;
import com.labmanagement.backend.modules.project.dto.ProjectVO;
import com.labmanagement.backend.modules.project.entity.Project;

/**
 * Service for Project, acting as the main entry point for project-related business logic.
 * 作为项目模块的业务总入口，负责项目的创建、信息更新、成员管理、状态流转等复杂流程。
 *
 * @author Ge
 * @since 2025-07-12
 */
public interface ProjectService extends IService<Project> {

    /**
     * Creates a new project.
     * 创建一个新项目。
     *
     * @param createDTO The DTO with project details.
     * @return The created project's view object.
     */
    ProjectVO createProject(ProjectCreateDTO createDTO);

    /**
     * Updates an existing project.
     * 更新一个已有的项目。
     *
     * @param updateDTO The DTO with fields to update.
     * @return The updated project's view object.
     */
    ProjectVO updateProject(ProjectUpdateDTO updateDTO);

    /**
     * Adds a member to a project.
     * 向项目中添加一个成员。
     *
     * @param addMemberDTO The DTO with member details.
     */
    void addMember(AddProjectMemberDTO addMemberDTO);

    /**
     * Retrieves project details by its ID.
     * 根据ID获取项目详情。
     *
     * @param projectId The ID of the project.
     * @return The project's detailed view object.
     */
    ProjectVO getProjectDetails(Long projectId);
}
