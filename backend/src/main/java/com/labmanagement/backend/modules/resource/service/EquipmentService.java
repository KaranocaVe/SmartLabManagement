package com.labmanagement.backend.modules.resource.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.resource.entity.Equipment;
import com.labmanagement.backend.modules.resource.entity.ResourceRequest;

/**
 * Service for Equipment, handling core business logic like status changes and maintenance.
 * 封装所有与“设备”相关的核心业务，如状态变更、维护计划等。
 *
 * @author Gemini
 * @since 2025-07-11
 */
public interface EquipmentService extends IService<Equipment> {

    /**
     * Reserves an equipment based on an approved request.
     * 根据已批准的申请，预定设备。
     *
     * @param request The approved resource request for equipment.
     */
    void reserveEquipment(ResourceRequest request);

    /**
     * Records a new maintenance event for equipment.
     * 为设备记录一次新的维护事件。
     *
     * @param equipmentId The ID of the equipment.
     * @param description The description of the maintenance.
     * @param operatorId  The ID of the user performing the maintenance.
     */
    void recordMaintenance(Long equipmentId, String description, Long operatorId);
}

