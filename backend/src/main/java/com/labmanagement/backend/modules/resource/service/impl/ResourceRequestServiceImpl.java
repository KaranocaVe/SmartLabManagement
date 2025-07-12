package com.labmanagement.backend.modules.resource.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.common.enums.ResponseCode;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.common.utils.BeanCopyUtil;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestApproveDTO;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestCreateDTO;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestQueryDTO;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestVO;
import com.labmanagement.backend.modules.resource.entity.ResourceRequest;
import com.labmanagement.backend.modules.resource.mapper.ResourceRequestMapper;
import com.labmanagement.backend.modules.resource.service.EquipmentService;
import com.labmanagement.backend.modules.resource.service.LabService;
import com.labmanagement.backend.modules.resource.service.MaterialService;
import com.labmanagement.backend.modules.resource.service.ResourceRequestService;
import com.labmanagement.backend.modules.system.entity.User;
import com.labmanagement.backend.modules.system.mapper.PermissionMapper;
import com.labmanagement.backend.modules.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

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

    // 新增注入
    @Autowired
    private PermissionMapper permissionMapper;

    @Override
    @Transactional
    public ResourceRequestVO createRequest(ResourceRequestCreateDTO createDTO, Long applicantId) {
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

        if ("approved".equals(request.getStatus())) {
            switch (request.getRequestType()) {
                case "material":
                    materialService.fulfillMaterialRequest(request);
                    break;
                case "equipment":
                    equipmentService.reserveEquipment(request);
                    break;
                case "lab":
                    // labService.reserveLab(request);
                    break;
                default:
                    throw new BusinessException(ResponseCode.FAILURE.getCode(), "未知的资源申请类型");
            }
        }
        return convertToVO(request);
    }

    @Override
    public ResourceRequestVO getRequestDetails(Long requestId, User currentUser) {
        ResourceRequest request = this.getById(requestId);
        if (request == null) {
            throw new BusinessException(ResponseCode.NOT_FOUND);
        }
        // 权限检查：必须是申请人自己，或者是拥有审批权限的管理员
        boolean canView = request.getUserId().equals(currentUser.getId()) ||
                hasAuthority(currentUser.getId(), "resource:approve");
        if (!canView) {
            throw new BusinessException(ResponseCode.UNAUTHORIZED);
        }
        return convertToVO(request);
    }

    @Override
    public IPage<ResourceRequestVO> queryRequests(ResourceRequestQueryDTO queryDTO, User currentUser) {
        LambdaQueryWrapper<ResourceRequest> wrapper = new LambdaQueryWrapper<>();

        // 权限控制：如果用户没有审批权限，则强制只能查询自己的申请
        boolean canViewAll = hasAuthority(currentUser.getId(), "resource:approve");
        if (!canViewAll) {
            wrapper.eq(ResourceRequest::getUserId, currentUser.getId());
        }

        // 构建筛选条件
        wrapper.eq(StringUtils.hasText(queryDTO.getStatus()), ResourceRequest::getStatus, queryDTO.getStatus());
        wrapper.eq(StringUtils.hasText(queryDTO.getRequestType()), ResourceRequest::getRequestType, queryDTO.getRequestType());
        wrapper.orderByDesc(ResourceRequest::getCreatedAt);

        Page<ResourceRequest> page = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());
        IPage<ResourceRequest> requestPage = this.page(page, wrapper);

        return requestPage.convert(this::convertToVO);
    }

    private ResourceRequestVO convertToVO(ResourceRequest request) {
        ResourceRequestVO vo = BeanCopyUtil.copyProperties(request, ResourceRequestVO.class);
        User applicant = userService.getById(request.getUserId());
        if (applicant != null) {
            vo.setApplicantName(applicant.getRealName());
        }
        if (request.getApproverId() != null) {
            User approver = userService.getById(request.getApproverId());
            if (approver != null) {
                vo.setApproverName(approver.getRealName());
            }
        }
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

    /**
     * 检查用户是否拥有特定权限的私有辅助方法
     *
     * @param userId    用户ID
     * @param authority 权限码，例如 "resource:approve"
     * @return 如果拥有权限则返回 true，否则返回 false
     */
    private boolean hasAuthority(Long userId, String authority) {
        // 注意：此方法依赖于 PermissionMapper 中的自定义方法 findPermissionCodesByUserId
        List<String> authorities = permissionMapper.findPermissionCodesByUserId(userId);
        return authorities.contains(authority);
    }
}