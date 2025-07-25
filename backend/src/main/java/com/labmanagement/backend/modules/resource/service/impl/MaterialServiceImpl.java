package com.labmanagement.backend.modules.resource.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.common.enums.ResponseCode;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.common.utils.BeanCopyUtil;
import com.labmanagement.backend.modules.resource.dto.MaterialCreateDTO;
import com.labmanagement.backend.modules.resource.dto.MaterialStockAdjustDTO;
import com.labmanagement.backend.modules.resource.dto.MaterialUpdateDTO;
import com.labmanagement.backend.modules.resource.entity.Material;
import com.labmanagement.backend.modules.resource.entity.MaterialStockMovement;
import com.labmanagement.backend.modules.resource.entity.ResourceRequest;
import com.labmanagement.backend.modules.resource.mapper.MaterialMapper;
import com.labmanagement.backend.modules.resource.service.MaterialService;
import com.labmanagement.backend.modules.resource.service.MaterialStockMovementService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Implementation of MaterialService.
 *
 * @author Ge
 * @since 2025-07-11
 */
@Service
public class MaterialServiceImpl extends ServiceImpl<MaterialMapper, Material> implements MaterialService {

    @Autowired
    private MaterialStockMovementService movementService;

    @Override
    @Transactional
    public Material createMaterial(MaterialCreateDTO createDTO) {
        Material material = BeanCopyUtil.copyProperties(createDTO, Material.class);
        // 新物资的初始库存为0
        material.setCurrentStock(BigDecimal.ZERO);
        this.save(material);
        return material;
    }

    @Override
    @Transactional
    public Material updateMaterial(MaterialUpdateDTO updateDTO) {
        Material material = this.getById(updateDTO.getId());
        if (material == null) {
            throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "要更新的物资不存在");
        }
        // 使用 BeanUtils.copyProperties 将 DTO 中的非空属性覆盖到实体上
        BeanUtils.copyProperties(updateDTO, material);
        this.updateById(material);
        return material;
    }

    @Override
    @Transactional
    public void fulfillMaterialRequest(ResourceRequest request) {
        Material material = this.getById(request.getResourceId());
        BigDecimal requestedQuantity = request.getQuantity();

        if (material == null) {
            throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "申请的物资不存在");
        }
        if (material.getCurrentStock().compareTo(requestedQuantity) < 0) {
            throw new BusinessException(ResponseCode.INSUFFICIENT_STOCK);
        }

        // 1. Update stock
        material.setCurrentStock(material.getCurrentStock().subtract(requestedQuantity));
        this.updateById(material);

        // 2. Record stock movement
        MaterialStockMovement movement = new MaterialStockMovement();
        movement.setMaterialId(material.getId());
        movement.setMovementType("outbound_request");
        movement.setQuantityChange(requestedQuantity.negate()); // Outbound is negative
        movement.setUserId(request.getUserId());
        movement.setSourceDocumentId(request.getId());
        movementService.save(movement);
    }

    @Override
    @Transactional
    public void adjustStock(MaterialStockAdjustDTO adjustDTO, Long operatorId) {
        Material material = this.getById(adjustDTO.getMaterialId());
        if (material == null) {
            throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "要调整的物资不存在");
        }

        // 1. Update stock
        material.setCurrentStock(material.getCurrentStock().add(adjustDTO.getQuantityChange()));
        this.updateById(material);

        // 2. Record stock movement
        MaterialStockMovement movement = new MaterialStockMovement();
        movement.setMaterialId(material.getId());
        movement.setMovementType(adjustDTO.getMovementType()); // 'inbound' or 'adjustment'
        movement.setQuantityChange(adjustDTO.getQuantityChange());
        movement.setUserId(operatorId);
        // For adjustments, there might not be a source document
        movementService.save(movement);
    }
}