package com.labmanagement.backend.modules.resource.service;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestApproveDTO;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestCreateDTO;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestQueryDTO;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestVO;
import com.labmanagement.backend.modules.resource.entity.ResourceRequest;
import com.labmanagement.backend.modules.system.entity.User;

/**
 * Service for orchestrating the entire resource request process.
 * 作为资源申请流程的总入口，负责整个流程的驱动和事务控制。
 *
 * @author Gemini
 * @since 2025-07-11
 */
public interface ResourceRequestService extends IService<ResourceRequest> {

    /**
     * Creates a new resource request.
     * 创建一个新的资源申请。
     *
     * @param createDTO   The DTO with request details.
     * @param applicantId The ID of the user creating the request.
     * @return A VO representing the created request.
     */
    ResourceRequestVO createRequest(ResourceRequestCreateDTO createDTO, Long applicantId);

    /**
     * Approves or rejects a resource request.
     * 审批（同意或拒绝）一个资源申请。
     *
     * @param approveDTO The DTO with approval details.
     * @param approverId The ID of the user approving the request.
     * @return A VO representing the updated request.
     */
    ResourceRequestVO approveRequest(ResourceRequestApproveDTO approveDTO, Long approverId);

    /**
     * 获取资源申请详情。
     *
     * @param requestId   资源申请ID
     * @param currentUser 当前用户
     * @return 资源申请详情VO
     */
    ResourceRequestVO getRequestDetails(Long requestId, User currentUser);
    
    /**
     * 查询资源申请列表。
     *
     * @param queryDTO    查询条件DTO
     * @param currentUser 当前用户
     * @return 分页的资源申请VO列表
     */
    IPage<ResourceRequestVO> queryRequests(ResourceRequestQueryDTO queryDTO, User currentUser);

}
