package com.labmanagement.backend.modules.resource.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.dto.PageRequestDTO;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.resource.dto.MaterialStockAdjustDTO;
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
 * @author Gemini
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/materials")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    /**
     * 分页查询物资列表
     *
     * @param pageRequestDTO 分页请求参数
     * @return 分页的物资列表
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()") // 任何认证用户都可以查看物资列表
    public ApiResponse<IPage<Material>> getMaterialPage(@Valid PageRequestDTO pageRequestDTO) {
        IPage<Material> page = materialService.page(new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(pageRequestDTO.getPageNum(), pageRequestDTO.getPageSize()));
        return ApiResponse.success(page);
    }

    /**
     * 创建新的物资信息
     *
     * @param material 物资实体
     * @return 创建后的物资实体
     */
    @PostMapping
    @PreAuthorize("hasAuthority('material:manage')")
    @AuditLog(description = "创建新的物资")
    public ApiResponse<Material> createMaterial(@Valid @RequestBody Material material) {
        materialService.save(material);
        return ApiResponse.success(material);
    }

    /**
     * 更新物资信息
     *
     * @param id       物资ID
     * @param material 包含更新信息的物资实体
     * @return 更新后的物资实体
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('material:manage')")
    @AuditLog(description = "更新物资信息")
    public ApiResponse<Material> updateMaterial(@PathVariable Long id, @Valid @RequestBody Material material) {
        material.setId(id);
        materialService.updateById(material);
        return ApiResponse.success(material);
    }

    /**
     * 调整物资库存（入库或盘点）
     *
     * @param adjustDTO   库存调整信息
     * @param currentUser 当前操作员
     * @return 操作成功响应
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