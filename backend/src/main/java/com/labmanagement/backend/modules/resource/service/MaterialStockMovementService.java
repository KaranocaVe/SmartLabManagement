package com.labmanagement.backend.modules.resource.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.resource.entity.MaterialStockMovement;

/**
 * Service for MaterialStockMovement.
 * 封装对 `material_stock_movements` 流水表的原子操作。
 *
 * @author Gemini
 * @since 2025-07-11
 */
public interface MaterialStockMovementService extends IService<MaterialStockMovement> {
    // This service primarily provides basic CRUD operations via IService.
    // Custom business logic can be added here if needed in the future.
}