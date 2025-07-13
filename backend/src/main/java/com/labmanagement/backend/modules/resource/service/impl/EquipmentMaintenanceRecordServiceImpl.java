package com.labmanagement.backend.modules.resource.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.modules.resource.entity.EquipmentMaintenanceRecord;
import com.labmanagement.backend.modules.resource.mapper.EquipmentMaintenanceRecordMapper;
import com.labmanagement.backend.modules.resource.service.EquipmentMaintenanceRecordService;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

/**
 * Implementation of EquipmentMaintenanceRecordService.
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Service
@Primary
public class EquipmentMaintenanceRecordServiceImpl extends ServiceImpl<EquipmentMaintenanceRecordMapper, EquipmentMaintenanceRecord> implements EquipmentMaintenanceRecordService {
}