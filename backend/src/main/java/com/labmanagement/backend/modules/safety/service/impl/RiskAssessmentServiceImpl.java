package com.labmanagement.backend.modules.safety.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.common.utils.BeanCopyUtil;
import com.labmanagement.backend.modules.safety.dto.RiskAssessmentCreateDTO;
import com.labmanagement.backend.modules.safety.dto.RiskAssessmentVO;
import com.labmanagement.backend.modules.safety.entity.RiskAssessment;
import com.labmanagement.backend.modules.safety.mapper.RiskAssessmentMapper;
import com.labmanagement.backend.modules.safety.service.RiskAssessmentService;
import com.labmanagement.backend.modules.system.entity.User;
import com.labmanagement.backend.modules.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Implementation of RiskAssessmentService.
 *
 * @author Gemini
 * @since 2025-07-12
 */
@Service
public class RiskAssessmentServiceImpl extends ServiceImpl<RiskAssessmentMapper, RiskAssessment> implements RiskAssessmentService {

    @Autowired
    private UserService userService;

    @Override
    public RiskAssessmentVO createAssessment(RiskAssessmentCreateDTO createDTO, Long assessorId) {
        RiskAssessment assessment = BeanCopyUtil.copyProperties(createDTO, RiskAssessment.class);
        assessment.setAssessedByUserId(assessorId);
        this.save(assessment);
        return convertToVO(assessment);
    }

    @Override
    public RiskAssessmentVO getAssessmentDetails(Long assessmentId) {
        RiskAssessment assessment = this.getById(assessmentId);
        if (assessment == null) {
            return null;
        }
        return convertToVO(assessment);
    }

    private RiskAssessmentVO convertToVO(RiskAssessment assessment) {
        RiskAssessmentVO vo = BeanCopyUtil.copyProperties(assessment, RiskAssessmentVO.class);
        User assessor = userService.getById(assessment.getAssessedByUserId());
        if (assessor != null) {
            vo.setAssessedByUserName(assessor.getRealName());
        }
        return vo;
    }
}