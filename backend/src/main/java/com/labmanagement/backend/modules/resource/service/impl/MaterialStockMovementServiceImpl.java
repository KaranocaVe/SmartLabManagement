package com.labmanagement.backend.modules.resource.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.modules.resource.entity.MaterialStockMovement;
import com.labmanagement.backend.modules.resource.mapper.MaterialStockMovementMapper;
import com.labmanagement.backend.modules.resource.service.MaterialStockMovementService;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;


/**
 * Implementation of MaterialStockMovementService.
 *
 * @author Ge
 * @since 2025-07-11
 */
@Service
@Primary
public class MaterialStockMovementServiceImpl extends ServiceImpl<MaterialStockMovementMapper, MaterialStockMovement> implements MaterialStockMovementService {
    // Inherits powerful CRUD capabilities from ServiceImpl. No additional implementation is needed for now.
}