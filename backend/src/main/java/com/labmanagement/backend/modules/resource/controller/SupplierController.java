package com.labmanagement.backend.modules.resource.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.dto.PageRequestDTO;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.resource.entity.Supplier;
import com.labmanagement.backend.modules.resource.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * 供应商管理控制器
 * <p>
 * 管理“供应商”主数据。提供供应商的增、删、改、查等基础接口。
 * </p>
 *
 * @author Ge
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    /**
     * 分页查询供应商列表
     *
     * @param pageRequestDTO 分页请求参数
     * @return 分页的供应商列表
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()") // 任何认证用户都可以查看供应商列表
    public ApiResponse<IPage<Supplier>> getSupplierPage(@Valid PageRequestDTO pageRequestDTO) {
        IPage<Supplier> page = supplierService.page(new Page<>(pageRequestDTO.getPageNum(), pageRequestDTO.getPageSize()));
        return ApiResponse.success(page);
    }

    /**
     * 获取单个供应商的详细信息
     *
     * @param id 供应商ID
     * @return 单个供应商的详细信息
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Supplier> getSupplierById(@PathVariable Long id) {
        Supplier supplier = supplierService.getById(id);
        return ApiResponse.success(supplier);
    }

    /**
     * 创建新的供应商信息
     *
     * @param supplier 供应商实体
     * @return 创建后的供应商实体
     */
    @PostMapping
    @PreAuthorize("hasAuthority('supplier:manage')") // 假设有 'supplier:manage' 权限
    @AuditLog(description = "创建新供应商")
    public ApiResponse<Supplier> createSupplier(@Valid @RequestBody Supplier supplier) {
        supplierService.save(supplier);
        return ApiResponse.success(supplier);
    }

    /**
     * 更新供应商信息
     *
     * @param id       供应商ID
     * @param supplier 包含更新信息的供应商实体
     * @return 更新后的供应商实体
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('supplier:manage')")
    @AuditLog(description = "更新供应商信息")
    public ApiResponse<Supplier> updateSupplier(@PathVariable Long id, @Valid @RequestBody Supplier supplier) {
        supplier.setId(id);
        supplierService.updateById(supplier);
        return ApiResponse.success(supplier);
    }

    /**
     * 删除供应商信息
     *
     * @param id 供应商ID
     * @return 操作成功响应
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('supplier:manage')")
    @AuditLog(description = "删除供应商")
    public ApiResponse<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.removeById(id);
        return ApiResponse.success();
    }
}