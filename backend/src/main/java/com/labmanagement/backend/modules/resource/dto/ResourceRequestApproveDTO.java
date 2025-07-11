package com.labmanagement.backend.modules.resource.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * DTO for approving a resource request.
 * 用于管理员审批资源申请时，封装审批结果（同意/拒绝）和意见。
 */
@Data
public class ResourceRequestApproveDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull(message = "申请ID不能为空")
    private Long requestId;

    @NotBlank(message = "审批状态不能为空")
    private String status; // 'approved', 'rejected'

    private String approvalNotes;
}