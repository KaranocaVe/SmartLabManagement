package com.labmanagement.backend.modules.project.controller;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.project.dto.ProjectTaskCreateDTO;
import com.labmanagement.backend.modules.project.dto.ProjectTaskUpdateDTO;
import com.labmanagement.backend.modules.project.entity.ProjectTask;
import com.labmanagement.backend.modules.project.service.ProjectTaskService;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 项目任务管理控制器
 * <p>
 * 核心职责: 管理项目下的具体任务。
 * </p>
 *
 * @author Ge
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/project-tasks")
public class ProjectTaskController {

    @Autowired
    private ProjectTaskService projectTaskService;

    /**
     * 为指定项目创建新任务
     *
     * @param createDTO 任务创建信息
     * @return 创建后的任务实体
     */
    @PostMapping
    @PreAuthorize("hasAuthority('project:edit')") // 假设项目编辑者可以创建任务
    @AuditLog(description = "创建项目任务")
    public ApiResponse<ProjectTask> createTask(@Valid @RequestBody ProjectTaskCreateDTO createDTO) {
        ProjectTask task = new ProjectTask();
        BeanUtils.copyProperties(createDTO, task);
        task.setStatus("todo"); // 初始状态为 '待办'
        projectTaskService.save(task);
        return ApiResponse.success(task);
    }

    /**
     * 查询指定项目下的所有任务
     *
     * @param projectId 项目ID
     * @return 该项目下的任务列表
     */
    @GetMapping("/project/{projectId}")
    @PreAuthorize("isAuthenticated()") // 假设项目成员可以查看任务
    public ApiResponse<List<ProjectTask>> getTasksByProjectId(@PathVariable Long projectId) {
        List<ProjectTask> tasks = projectTaskService.list(
                new LambdaQueryWrapper<ProjectTask>().eq(ProjectTask::getProjectId, projectId)
        );
        return ApiResponse.success(tasks);
    }

    /**
     * 更新指定任务的信息
     *
     * @param id        任务ID
     * @param updateDTO 包含更新信息的DTO
     * @return 更新后的任务实体
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('project:edit')")
    @AuditLog(description = "更新项目任务")
    public ApiResponse<ProjectTask> updateTask(@PathVariable Long id, @Valid @RequestBody ProjectTaskUpdateDTO updateDTO) {
        ProjectTask task = projectTaskService.getById(id);
        if (task == null) {
            return ApiResponse.error(404, "任务不存在");
        }
        BeanUtils.copyProperties(updateDTO, task);
        projectTaskService.updateById(task);
        return ApiResponse.success(task);
    }

    /**
     * 删除一个任务
     *
     * @param id 任务ID
     * @return 操作成功响应
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('project:edit')")
    @AuditLog(description = "删除项目任务")
    public ApiResponse<Void> deleteTask(@PathVariable Long id) {
        projectTaskService.removeById(id);
        return ApiResponse.success();
    }
}