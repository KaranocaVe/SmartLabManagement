package com.labmanagement.backend.modules.safety.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.safety.dto.RiskAssessmentCreateDTO;
import com.labmanagement.backend.modules.safety.dto.RiskAssessmentVO;
import com.labmanagement.backend.modules.safety.entity.RiskAssessment;

/**
 * Service for RiskAssessment.
 * 封装创建和查询风险评估的业务逻辑。
 *
 * @author Ge
 * @since 2025-07-12
 */
public interface RiskAssessmentService extends IService<RiskAssessment> {

    /**
     * Creates a new risk assessment.
     * 创建一个新的风险评估。
     *
     * @param createDTO  The DTO with assessment details.
     * @param assessorId The ID of the user performing the assessment.
     * @return A VO representing the created assessment.
     */
    RiskAssessmentVO createAssessment(RiskAssessmentCreateDTO createDTO, Long assessorId);

    /**
     * Retrieves risk assessment details by its ID.
     * 根据ID获取风险评估详情。
     *
     * @param assessmentId The ID of the assessment.
     * @return The assessment's detailed view object.
     */
    RiskAssessmentVO getAssessmentDetails(Long assessmentId);
}