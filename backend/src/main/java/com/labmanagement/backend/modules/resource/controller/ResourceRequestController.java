package com.labmanagement.backend.modules.resource.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestApproveDTO;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestCreateDTO;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestQueryDTO;
import com.labmanagement.backend.modules.resource.dto.ResourceRequestVO;
import com.labmanagement.backend.modules.resource.service.ResourceRequestService;
import com.labmanagement.backend.modules.system.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 资源申请与审批控制器
 * <p>
 * 提供资源申请、审批、查询申请列表等接口。
 * </p>
 *
 * @author Ge
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/resource-requests")
public class ResourceRequestController {

    @Autowired
    private ResourceRequestService resourceRequestService;

    /**
     * 创建一个新的资源申请
     *
     * @param createDTO   包含申请详情的数据传输对象
     * @param currentUser 当前登录的用户实体，由 Spring Security 自动注入
     * @return 包含创建后申请详情的响应
     */
    @PostMapping
    @PreAuthorize("hasAuthority('resource:request')")
    @AuditLog(description = "发起资源申请")
    public ApiResponse<ResourceRequestVO> createResourceRequest(
            @Valid @RequestBody ResourceRequestCreateDTO createDTO,
            @AuthenticationPrincipal User currentUser) {

        // 从安全上下文中获取当前登录用户的ID
        Long applicantId = currentUser.getId();
        ResourceRequestVO createdRequest = resourceRequestService.createRequest(createDTO, applicantId);
        return ApiResponse.success(createdRequest);
    }

    /**
     * 审批一个资源申请
     *
     * @param approveDTO  包含审批结果的数据传输对象
     * @param currentUser 当前登录的用户实体，即审批人
     * @return 包含更新后申请详情的响应
     */
    @PutMapping("/approval")
    @PreAuthorize("hasAuthority('resource:approve')")
    @AuditLog(description = "审批资源申请")
    public ApiResponse<ResourceRequestVO> approveResourceRequest(
            @Valid @RequestBody ResourceRequestApproveDTO approveDTO,
            @AuthenticationPrincipal User currentUser) {

        Long approverId = currentUser.getId();
        ResourceRequestVO approvedRequest = resourceRequestService.approveRequest(approveDTO, approverId);
        return ApiResponse.success(approvedRequest);
    }

    /**
     * 获取单个资源申请的详细信息
     *
     * @param id          申请记录的ID
     * @param currentUser 当前登录的用户实体
     * @return 单个申请记录的详细视图
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()") // 具体的权限检查（是否为本人或管理员）在服务层完成
    public ApiResponse<ResourceRequestVO> getRequestById(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        ResourceRequestVO requestDetails = resourceRequestService.getRequestDetails(id, currentUser);
        return ApiResponse.success(requestDetails);
    }

    /**
     * 分页查询资源申请列表
     * <p>
     * - 普通用户只能看到自己的申请。
     * - 拥有审批权限的用户可以看到所有申请，并可按条件筛选。
     * </p>
     *
     * @param queryDTO    包含分页和筛选条件的查询对象
     * @param currentUser 当前登录的用户实体
     * @return 分页的申请记录列表
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<IPage<ResourceRequestVO>> getRequests(
            @Valid ResourceRequestQueryDTO queryDTO,
            @AuthenticationPrincipal User currentUser) {
        IPage<ResourceRequestVO> page = resourceRequestService.queryRequests(queryDTO, currentUser);
        return ApiResponse.success(page);
    }
}
