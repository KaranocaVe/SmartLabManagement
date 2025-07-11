package com.labmanagement.backend.modules.resource.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.common.enums.ResponseCode;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.modules.resource.entity.Equipment;
import com.labmanagement.backend.modules.resource.entity.EquipmentMaintenanceRecord;
import com.labmanagement.backend.modules.resource.entity.ResourceRequest;
import com.labmanagement.backend.modules.resource.mapper.EquipmentMapper;
import com.labmanagement.backend.modules.resource.service.EquipmentMaintenanceRecordService;
import com.labmanagement.backend.modules.resource.service.EquipmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Implementation of EquipmentService.
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Service
@Slf4j
public class EquipmentServiceImpl extends ServiceImpl<EquipmentMapper, Equipment> implements EquipmentService {

    @Autowired
    private EquipmentMaintenanceRecordService maintenanceRecordService;

    @Override
    @Transactional
    public void reserveEquipment(ResourceRequest request) {
        Equipment equipment = this.getById(request.getResourceId());
        if (equipment == null) {
            throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "要预定的设备不存在");
        }
        // A more complex logic should be here to check for time conflicts.
        // For now, we just log it.
        log.info("设备 [ID: {}, 名称: {}] 已被成功预定。", equipment.getId(), equipment.getName());
        // Optionally, update the equipment status if it's a simple reservation system.
        // equipment.setStatus("reserved");
        // this.updateById(equipment);
    }

    @Override
    @Transactional
    public void recordMaintenance(Long equipmentId, String description, Long operatorId) {
        Equipment equipment = this.getById(equipmentId);
        if (equipment == null) {
            throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "要维护的设备不存在");
        }

        // 1. Create and save a new maintenance record
        EquipmentMaintenanceRecord record = new EquipmentMaintenanceRecord();
        record.setEquipmentId(equipmentId);
        record.setDescription(description);
        record.setMaintenanceDate(LocalDate.now());
        record.setType("repair"); // Assuming it's an ad-hoc repair
        // In a real scenario, the technician might be a specific field from a DTO
        record.setTechnician("Operator " + operatorId);
        maintenanceRecordService.save(record);

        // 2. Update equipment status and next maintenance date
        equipment.setStatus("available"); // Assuming maintenance is complete
        if (equipment.getMaintenanceCycleDays() != null) {
            equipment.setNextMaintenanceDate(LocalDate.now().plusDays(equipment.getMaintenanceCycleDays()));
        }
        this.updateById(equipment);
        log.info("设备 [ID: {}] 的维护记录已添加。", equipmentId);
    }
}
