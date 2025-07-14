package com.labmanagement.backend.modules.resource.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.common.enums.ResponseCode;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.common.utils.BeanCopyUtil;
import com.labmanagement.backend.modules.resource.dto.EquipmentCreateDTO;
import com.labmanagement.backend.modules.resource.dto.EquipmentUpdateDTO;
import com.labmanagement.backend.modules.resource.entity.Equipment;
import com.labmanagement.backend.modules.resource.entity.EquipmentMaintenanceRecord;
import com.labmanagement.backend.modules.resource.entity.ResourceRequest;
import com.labmanagement.backend.modules.resource.mapper.EquipmentMapper;
import com.labmanagement.backend.modules.resource.service.EquipmentMaintenanceRecordService;
import com.labmanagement.backend.modules.resource.service.EquipmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Slf4j
public class EquipmentServiceImpl extends ServiceImpl<EquipmentMapper, Equipment> implements EquipmentService {

    @Autowired
    private EquipmentMaintenanceRecordService maintenanceRecordService;

    @Override
    @Transactional
    public Equipment createEquipment(EquipmentCreateDTO createDTO) {
        Equipment equipment = BeanCopyUtil.copyProperties(createDTO, Equipment.class);
        equipment.setStatus("available"); // 新设备默认为可用状态
        this.save(equipment);
        return equipment;
    }

    @Override
    @Transactional
    public Equipment updateEquipment(EquipmentUpdateDTO updateDTO) {
        Equipment equipment = this.getById(updateDTO.getId());
        if (equipment == null) {
            throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "要更新的设备不存在");
        }
        BeanUtils.copyProperties(updateDTO, equipment);
        this.updateById(equipment);
        return equipment;
    }

    @Override
    @Transactional
    public void reserveEquipment(ResourceRequest request) {
        Equipment equipment = this.getById(request.getResourceId());
        if (equipment == null) {
            throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "要预定的设备不存在");
        }
        log.info("设备 [ID: " + equipment.getId() + ", 名称: " + equipment.getName() + "] 已被成功预定。");
    }

    @Override
    @Transactional
    public void recordMaintenance(Long equipmentId, String description, Long operatorId) {
        Equipment equipment = this.getById(equipmentId);
        if (equipment == null) {
            throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "要维护的设备不存在");
        }
        EquipmentMaintenanceRecord record = new EquipmentMaintenanceRecord();
        record.setEquipmentId(equipmentId);
        record.setDescription(description);
        record.setMaintenanceDate(LocalDate.now());
        record.setType("repair");
        record.setTechnician("Operator " + operatorId);
        maintenanceRecordService.save(record);

        equipment.setStatus("available");
        if (equipment.getMaintenanceCycleDays() != null) {
            equipment.setNextMaintenanceDate(LocalDate.now().plusDays(equipment.getMaintenanceCycleDays()));
        }
        this.updateById(equipment);
        log.info("设备 [ID: " + equipmentId + "] 的维护记录已添加。");
    }
}