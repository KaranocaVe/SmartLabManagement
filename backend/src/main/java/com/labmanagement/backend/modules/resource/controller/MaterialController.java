package com.labmanagement.backend.modules.resource.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.dto.PageRequestDTO;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.resource.dto.MaterialCreateDTO;
import com.labmanagement.backend.modules.resource.dto.MaterialStockAdjustDTO;
import com.labmanagement.backend.modules.resource.dto.MaterialUpdateDTO;
import com.labmanagement.backend.modules.resource.entity.Material;
import com.labmanagement.backend.modules.resource.service.MaterialService;
import com.labmanagement.backend.modules.system.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 物资管理控制器
 * <p>
 * 管理“物资”主数据。提供物资信息管理、库存调整等接口。
 * </p>
 *
 * @author Ge
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/materials")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    /**
     * 分页查询物资列表
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<IPage<Material>> getMaterialPage(@Valid PageRequestDTO pageRequestDTO) {
        IPage<Material> page = materialService.page(new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(pageRequestDTO.getPageNum(), pageRequestDTO.getPageSize()));
        return ApiResponse.success(page);
    }

    /**
     * 创建新的物资信息
     */
    @PostMapping
    @PreAuthorize("hasAuthority('material:manage')")
    @AuditLog(description = "创建新的物资")
    public ApiResponse<Material> createMaterial(@Valid @RequestBody MaterialCreateDTO createDTO) {
        Material createdMaterial = materialService.createMaterial(createDTO);
        return ApiResponse.success(createdMaterial);
    }

    /**
     * 更新物资信息
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('material:manage')")
    @AuditLog(description = "更新物资信息")
    public ApiResponse<Material> updateMaterial(@PathVariable Long id, @Valid @RequestBody MaterialUpdateDTO updateDTO) {
        // 确保路径ID与请求体ID一致
        if (!id.equals(updateDTO.getId())) {
            throw new BusinessException(400, "路径ID与请求体ID不匹配");
        }
        Material updatedMaterial = materialService.updateMaterial(updateDTO);
        return ApiResponse.success(updatedMaterial);
    }

    /**
     * 调整物资库存（入库或盘点）
     */
    @PostMapping("/stock-adjustment")
    @PreAuthorize("hasAuthority('material:manage')")
    @AuditLog(description = "调整物资库存")
    public ApiResponse<Void> adjustStock(
            @Valid @RequestBody MaterialStockAdjustDTO adjustDTO,
            @AuthenticationPrincipal User currentUser) {

        materialService.adjustStock(adjustDTO, currentUser.getId());
        return ApiResponse.success();
    }
}
