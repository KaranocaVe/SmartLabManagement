package com.labmanagement.backend.modules.resource.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.common.enums.ResponseCode;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.common.utils.BeanCopyUtil;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestApproveDTO;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestCreateDTO;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestVO;
import com.labmanagement.backend.modules.resource.entity.ResourceRequest;
import com.labmanagement.backend.modules.resource.mapper.ResourceRequestMapper;
import com.labmanagement.backend.modules.resource.service.EquipmentService;
import com.labmanagement.backend.modules.resource.service.LabService;
import com.labmanagement.backend.modules.resource.service.MaterialService;
import com.labmanagement.backend.modules.resource.service.ResourceRequestService;
import com.labmanagement.backend.modules.system.entity.User;
import com.labmanagement.backend.modules.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of ResourceRequestService.
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Service
public class ResourceRequestServiceImpl extends ServiceImpl<ResourceRequestMapper, ResourceRequest> implements ResourceRequestService {

    @Autowired
    private MaterialService materialService;
    @Autowired
    private EquipmentService equipmentService;
    @Autowired
    private LabService labService;
    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public ResourceRequestVO createRequest(ResourceRequestCreateDTO createDTO, Long applicantId) {
        // Basic validation can be done here, e.g., check if resource exists
        // ...

        ResourceRequest request = new ResourceRequest();
        BeanCopyUtil.copyProperties(createDTO, request);
        request.setUserId(applicantId);
        request.setStatus("pending_approval");

        this.save(request);

        return convertToVO(request);
    }

    @Override
    @Transactional
    public ResourceRequestVO approveRequest(ResourceRequestApproveDTO approveDTO, Long approverId) {
        ResourceRequest request = this.getById(approveDTO.getRequestId());
        if (request == null || !"pending_approval".equals(request.getStatus())) {
            throw new BusinessException(ResponseCode.FAILURE.getCode(), "申请不存在或状态不正确，无法审批");
        }

        request.setStatus(approveDTO.getStatus());
        request.setApproverId(approverId);
        request.setApprovalNotes(approveDTO.getApprovalNotes());
        this.updateById(request);

        // If approved, execute subsequent resource change operations
        if ("approved".equals(request.getStatus())) {
            switch (request.getRequestType()) {
                case "material":
                    materialService.fulfillMaterialRequest(request);
                    break;
                case "equipment":
                    equipmentService.reserveEquipment(request);
                    break;
                case "lab":
                    // Assuming LabService has a similar method
                    // labService.reserveLab(request);
                    break;
                default:
                    throw new BusinessException(ResponseCode.FAILURE.getCode(), "未知的资源申请类型");
            }
        }

        return convertToVO(request);
    }

    /**
     * Private helper method to convert a ResourceRequest entity to a ResourceRequestVO.
     * This method will fetch associated names.
     *
     * @param request The ResourceRequest entity.
     * @return The populated ResourceRequestVO.
     */
    private ResourceRequestVO convertToVO(ResourceRequest request) {
        ResourceRequestVO vo = BeanCopyUtil.copyProperties(request, ResourceRequestVO.class);

        // Fetch and set applicant's name
        User applicant = userService.getById(request.getUserId());
        if (applicant != null) {
            vo.setApplicantName(applicant.getRealName());
        }

        // Fetch and set approver's name if exists
        if (request.getApproverId() != null) {
            User approver = userService.getById(request.getApproverId());
            if (approver != null) {
                vo.setApproverName(approver.getRealName());
            }
        }

        // Fetch and set resource's name based on type
        switch (request.getRequestType()) {
            case "material":
                vo.setResourceName(materialService.getById(request.getResourceId()).getName());
                break;
            case "equipment":
                vo.setResourceName(equipmentService.getById(request.getResourceId()).getName());
                break;
            case "lab":
                vo.setResourceName(labService.getById(request.getResourceId()).getName());
                break;
        }

        return vo;
    }
}
