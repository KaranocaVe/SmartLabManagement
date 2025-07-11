package com.labmanagement.backend.modules.resource.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.modules.resource.entity.Supplier;
import com.labmanagement.backend.modules.resource.mapper.SupplierMapper;
import com.labmanagement.backend.modules.resource.service.SupplierService;
import org.springframework.stereotype.Service;

/**
 * Implementation of SupplierService.
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Service
public class SupplierServiceImpl extends ServiceImpl<SupplierMapper, Supplier> implements SupplierService {
}
