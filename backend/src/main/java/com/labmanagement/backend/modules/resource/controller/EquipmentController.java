package com.labmanagement.backend.modules.resource.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.dto.PageRequestDTO;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.resource.dto.EquipmentCreateDTO;
import com.labmanagement.backend.modules.resource.dto.EquipmentUpdateDTO;
import com.labmanagement.backend.modules.resource.entity.Equipment;
import com.labmanagement.backend.modules.resource.service.EquipmentService;
import com.labmanagement.backend.modules.system.entity.User;
import jakarta.validation.Valid;
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
 * @author Ge
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<IPage<Equipment>> getEquipmentPage(@Valid PageRequestDTO pageRequestDTO) {
        IPage<Equipment> page = equipmentService.page(new Page<>(pageRequestDTO.getPageNum(), pageRequestDTO.getPageSize()));
        return ApiResponse.success(page);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Equipment> getEquipmentById(@PathVariable Long id) {
        Equipment equipment = equipmentService.getById(id);
        return ApiResponse.success(equipment);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('equipment:manage')")
    @AuditLog(description = "创建新设备")
    public ApiResponse<Equipment> createEquipment(@Valid @RequestBody EquipmentCreateDTO createDTO) {
        Equipment createdEquipment = equipmentService.createEquipment(createDTO);
        return ApiResponse.success(createdEquipment);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('equipment:manage')")
    @AuditLog(description = "更新设备信息")
    public ApiResponse<Equipment> updateEquipment(@PathVariable Long id, @Valid @RequestBody EquipmentUpdateDTO updateDTO) {
        if (!id.equals(updateDTO.getId())) {
            throw new BusinessException(400, "路径ID与请求体ID不匹配");
        }
        Equipment updatedEquipment = equipmentService.updateEquipment(updateDTO);
        return ApiResponse.success(updatedEquipment);
    }

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