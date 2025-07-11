package com.labmanagement.backend.modules.safety.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.safety.dto.SafetyIncidentCreateDTO;
import com.labmanagement.backend.modules.safety.dto.SafetyIncidentVO;
import com.labmanagement.backend.modules.safety.entity.SafetyIncident;

/**
 * Service for SafetyIncident.
 * 封装记录和查询安全事故的业务逻辑。
 *
 * @author Gemini
 * @since 2025-07-12
 */
public interface SafetyIncidentService extends IService<SafetyIncident> {

    /**
     * Records a new safety incident.
     * 记录一个新的安全事故。
     *
     * @param createDTO  The DTO with incident details.
     * @param reporterId The ID of the user reporting the incident.
     * @return A VO representing the recorded incident.
     */
    SafetyIncidentVO recordIncident(SafetyIncidentCreateDTO createDTO, Long reporterId);

    /**
     * Retrieves safety incident details by its ID.
     * 根据ID获取安全事故详情。
     *
     * @param incidentId The ID of the incident.
     * @return The incident's detailed view object.
     */
    SafetyIncidentVO getIncidentDetails(Long incidentId);
}