package com.labmanagement.backend.modules.resource.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.resource.dto.MaterialCreateDTO;
import com.labmanagement.backend.modules.resource.dto.MaterialStockAdjustDTO;
import com.labmanagement.backend.modules.resource.dto.MaterialUpdateDTO;
import com.labmanagement.backend.modules.resource.entity.Material;
import com.labmanagement.backend.modules.resource.entity.ResourceRequest;

/**
 * Service for Material, handling core business logic like stock management.
 * 封装所有与“物资”相关的核心业务，特别是库存管理。
 *
 * @author Gemini
 * @since 2025-07-11
 */
public interface MaterialService extends IService<Material> {

    /**
     * 创建新的物资
     * @param createDTO 物资创建信息
     * @return 创建后的物资实体
     */
    Material createMaterial(MaterialCreateDTO createDTO);

    /**
     * 更新物资信息
     * @param updateDTO 物资更新信息
     * @return 更新后的物资实体
     */
    Material updateMaterial(MaterialUpdateDTO updateDTO);

    /**
     * Fulfills a material request by deducting stock.
     * 根据已批准的物资申请，执行库存扣减操作。
     *
     * @param request The approved resource request for material.
     */
    void fulfillMaterialRequest(ResourceRequest request);

    /**
     * Adjusts material stock for inbound or correction.
     * 调整物资库存（入库或盘点）。
     *
     * @param adjustDTO  The DTO containing adjustment details.
     * @param operatorId The ID of the user performing the operation.
     */
    void adjustStock(MaterialStockAdjustDTO adjustDTO, Long operatorId);
}