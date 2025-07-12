package com.labmanagement.backend.modules.resource.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.dto.PageRequestDTO;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.resource.dto.EquipmentCreateDTO;
import com.labmanagement.backend.modules.resource.entity.Equipment;
import com.labmanagement.backend.modules.resource.service.EquipmentService;
import com.labmanagement.backend.modules.system.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 设备管理控制器
 * <p>
 * 管理“设备”主数据。提供设备的增、删、改、查以及记录维护事件等接口。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    /**
     * 分页查询设备列表
     *
     * @param pageRequestDTO 分页请求参数
     * @return 分页的设备列表
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()") // 任何认证用户都可以查看设备列表
    public ApiResponse<IPage<Equipment>> getEquipmentPage(@Valid PageRequestDTO pageRequestDTO) {
        IPage<Equipment> page = equipmentService.page(new Page<>(pageRequestDTO.getPageNum(), pageRequestDTO.getPageSize()));
        return ApiResponse.success(page);
    }

    /**
     * 获取单个设备的详细信息
     *
     * @param id 设备ID
     * @return 单个设备的详细信息
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Equipment> getEquipmentById(@PathVariable Long id) {
        Equipment equipment = equipmentService.getById(id);
        return ApiResponse.success(equipment);
    }

    /**
     * 创建新的设备信息
     *
     * @param createDTO 创建设备所需的数据
     * @return 创建后的设备实体
     */
    @PostMapping
    @PreAuthorize("hasAuthority('equipment:manage')")
    @AuditLog(description = "创建新设备")
    public ApiResponse<Equipment> createEquipment(@Valid @RequestBody EquipmentCreateDTO createDTO) {
        Equipment equipment = new Equipment();
        BeanUtils.copyProperties(createDTO, equipment);
        equipmentService.save(equipment);
        return ApiResponse.success(equipment);
    }

    /**
     * 更新设备信息
     *
     * @param id        设备ID
     * @param equipment 包含更新信息的设备实体
     * @return 更新后的设备实体
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('equipment:manage')")
    @AuditLog(description = "更新设备信息")
    public ApiResponse<Equipment> updateEquipment(@PathVariable Long id, @Valid @RequestBody Equipment equipment) {
        equipment.setId(id);
        equipmentService.updateById(equipment);
        return ApiResponse.success(equipment);
    }

    /**
     * 为设备记录一次维护事件
     *
     * @param id          设备ID
     * @param description 维护内容的描述，从请求体中获取
     * @param currentUser 当前操作员
     * @return 操作成功响应
     */
    @PostMapping("/{id}/maintenance")
    @PreAuthorize("hasAuthority('equipment:manage')")
    @AuditLog(description = "记录设备维护事件")
    public ApiResponse<Void> recordMaintenance(
            @PathVariable Long id,
            @RequestBody String description,
            @AuthenticationPrincipal User currentUser) {

        equipmentService.recordMaintenance(id, description, currentUser.getId());
        return ApiResponse.success();
    }
}