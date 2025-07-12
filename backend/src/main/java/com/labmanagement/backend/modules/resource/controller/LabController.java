package com.labmanagement.backend.modules.resource.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.dto.PageRequestDTO;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.resource.entity.Lab;
import com.labmanagement.backend.modules.resource.service.LabService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * 场地管理控制器
 * <p>
 * 管理“场地”主数据。提供场地的增、删、改、查等基础接口。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/labs")
public class LabController {

    @Autowired
    private LabService labService;

    /**
     * 分页查询场地列表
     *
     * @param pageRequestDTO 分页请求参数
     * @return 分页的场地列表
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()") // 任何认证用户都可以查看场地列表
    public ApiResponse<IPage<Lab>> getLabPage(@Valid PageRequestDTO pageRequestDTO) {
        IPage<Lab> page = labService.page(new Page<>(pageRequestDTO.getPageNum(), pageRequestDTO.getPageSize()));
        return ApiResponse.success(page);
    }

    /**
     * 获取单个场地的详细信息
     *
     * @param id 场地ID
     * @return 单个场地的详细信息
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Lab> getLabById(@PathVariable Integer id) {
        Lab lab = labService.getById(id);
        return ApiResponse.success(lab);
    }

    /**
     * 创建新的场地信息
     *
     * @param lab 场地实体
     * @return 创建后的场地实体
     */
    @PostMapping
    @PreAuthorize("hasAuthority('lab:manage')") // 假设有 'lab:manage' 权限
    @AuditLog(description = "创建新场地")
    public ApiResponse<Lab> createLab(@Valid @RequestBody Lab lab) {
        labService.save(lab);
        return ApiResponse.success(lab);
    }

    /**
     * 更新场地信息
     *
     * @param id  场地ID
     * @param lab 包含更新信息的场地实体
     * @return 更新后的场地实体
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('lab:manage')")
    @AuditLog(description = "更新场地信息")
    public ApiResponse<Lab> updateLab(@PathVariable Integer id, @Valid @RequestBody Lab lab) {
        lab.setId(id);
        labService.updateById(lab);
        return ApiResponse.success(lab);
    }

    /**
     * 删除场地信息
     *
     * @param id 场地ID
     * @return 操作成功响应
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('lab:manage')")
    @AuditLog(description = "删除场地")
    public ApiResponse<Void> deleteLab(@PathVariable Integer id) {
        labService.removeById(id);
        return ApiResponse.success();
    }
}