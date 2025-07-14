package com.labmanagement.backend.modules.resource.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.resource.dto.EquipmentCreateDTO;
import com.labmanagement.backend.modules.resource.dto.EquipmentUpdateDTO;
import com.labmanagement.backend.modules.resource.entity.Equipment;
import com.labmanagement.backend.modules.resource.entity.ResourceRequest;

public interface EquipmentService extends IService<Equipment> {

    /**
     * 创建新设备
     * @param createDTO 设备创建信息
     * @return 创建后的设备实体
     */
    Equipment createEquipment(EquipmentCreateDTO createDTO);

    /**
     * 更新设备信息
     * @param updateDTO 设备更新信息
     * @return 更新后的设备实体
     */
    Equipment updateEquipment(EquipmentUpdateDTO updateDTO);

    /**
     * 根据已批准的申请，预定设备。
     * @param request The approved resource request for equipment.
     */
    void reserveEquipment(ResourceRequest request);

    /**
     * 为设备记录一次新的维护事件。
     * @param equipmentId The ID of the equipment.
     * @param description The description of the maintenance.
     * @param operatorId  The ID of the user performing the maintenance.
     */
    void recordMaintenance(Long equipmentId, String description, Long operatorId);
}