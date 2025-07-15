package com.labmanagement.backend.modules.project.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.dto.PageRequestDTO;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.project.dto.ExperimentRecordCreateDTO;
import com.labmanagement.backend.modules.project.entity.ExperimentRecord;
import com.labmanagement.backend.modules.project.service.ExperimentRecordService;
import com.labmanagement.backend.modules.system.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 实验记录控制器
 * <p>
 * 核心职责: 管理实验记录的创建和查询。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/experiment-records")
public class ExperimentRecordController {

    @Autowired
    private ExperimentRecordService experimentRecordService;

    /**
     * 创建新的实验记录
     *
     * @param createDTO   实验记录的创建信息
     * @param currentUser 当前登录用户
     * @return 创建后的实验记录实体
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()") // 假设项目成员才能创建，具体权限在服务层或前端控制
    @AuditLog(description = "创建新的实验记录")
    public ApiResponse<ExperimentRecord> createExperimentRecord(
            @Valid @RequestBody ExperimentRecordCreateDTO createDTO,
            @AuthenticationPrincipal User currentUser) {

        ExperimentRecord createdRecord = experimentRecordService.createRecord(createDTO, currentUser.getId());
        return ApiResponse.success(createdRecord);
    }

    /**
     * 获取单条实验记录详情
     *
     * @param id 实验记录ID
     * @return 实验记录的详细信息
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<ExperimentRecord> getRecordById(@PathVariable Long id) {
        // 可以在服务层增加权限校验，确保只有项目成员能查看
        ExperimentRecord record = experimentRecordService.getById(id);
        return ApiResponse.success(record);
    }

    /**
     * 查询指定项目下的实验记录列表（分页）
     *
     * @param projectId      项目ID
     * @param pageRequestDTO 分页参数
     * @return 分页的实验记录列表
     */
    @GetMapping("/project/{projectId}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<IPage<ExperimentRecord>> getRecordsByProjectId(
            @PathVariable Long projectId,
            @Valid PageRequestDTO pageRequestDTO) {

        LambdaQueryWrapper<ExperimentRecord> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ExperimentRecord::getProjectId, projectId);
        queryWrapper.orderByDesc(ExperimentRecord::getRecordTime); // 按记录时间降序

        IPage<ExperimentRecord> page = experimentRecordService.page(
                new Page<>(pageRequestDTO.getPageNum(), pageRequestDTO.getPageSize()),
                queryWrapper
        );
        return ApiResponse.success(page);
    }
}
