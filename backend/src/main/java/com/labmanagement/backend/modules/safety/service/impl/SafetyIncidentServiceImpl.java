package com.labmanagement.backend.modules.safety.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.common.utils.BeanCopyUtil;
import com.labmanagement.backend.modules.resource.entity.Lab;
import com.labmanagement.backend.modules.resource.service.LabService;
import com.labmanagement.backend.modules.safety.dto.SafetyIncidentCreateDTO;
import com.labmanagement.backend.modules.safety.dto.SafetyIncidentVO;
import com.labmanagement.backend.modules.safety.entity.SafetyIncident;
import com.labmanagement.backend.modules.safety.mapper.SafetyIncidentMapper;
import com.labmanagement.backend.modules.safety.service.SafetyIncidentService;
import com.labmanagement.backend.modules.system.entity.User;
import com.labmanagement.backend.modules.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Implementation of SafetyIncidentService.
 *
 * @author Ge
 * @since 2025-07-12
 */
@Service
public class SafetyIncidentServiceImpl extends ServiceImpl<SafetyIncidentMapper, SafetyIncident> implements SafetyIncidentService {

    @Autowired
    private UserService userService;

    @Autowired
    private LabService labService;

    @Override
    public SafetyIncidentVO recordIncident(SafetyIncidentCreateDTO createDTO, Long reporterId) {
        SafetyIncident incident = BeanCopyUtil.copyProperties(createDTO, SafetyIncident.class);
        incident.setReportedByUserId(reporterId);
        this.save(incident);
        return convertToVO(incident);
    }

    @Override
    public SafetyIncidentVO getIncidentDetails(Long incidentId) {
        SafetyIncident incident = this.getById(incidentId);
        if (incident == null) {
            return null;
        }
        return convertToVO(incident);
    }

    private SafetyIncidentVO convertToVO(SafetyIncident incident) {
        SafetyIncidentVO vo = BeanCopyUtil.copyProperties(incident, SafetyIncidentVO.class);

        // 填充报告人姓名
        User reporter = userService.getById(incident.getReportedByUserId());
        if (reporter != null) {
            vo.setReportedByUserName(reporter.getRealName());
        }

        // 填充实验室名称
        if (incident.getLabId() != null) {
            Lab lab = labService.getById(incident.getLabId());
            if (lab != null) {
                vo.setLabName(lab.getName());
            }
        }
        return vo;
    }
}