package com.labmanagement.backend.modules.resource.entity;


import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 统一资源申请表实体类
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
@TableName("resource_requests")
public class ResourceRequest implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 申请ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 申请人ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 请求类型: 'equipment', 'lab', 'material'
     */
    @TableField("request_type")
    private String requestType;

    /**
     * 资源ID
     */
    @TableField("resource_id")
    private Long resourceId;

    /**
     * 申请数量(用于物资)
     */
    @TableField("quantity")
    private BigDecimal quantity;

    /**
     * 预定开始时间
     */
    @TableField("start_time")
    private LocalDateTime startTime;

    /**
     * 预定结束时间
     */
    @TableField("end_time")
    private LocalDateTime endTime;

    /**
     * 申请事由
     */
    @TableField("purpose")
    private String purpose;

    /**
     * 状态: 'pending_approval', 'approved', 'rejected', 'completed', 'cancelled'
     */
    @TableField("status")
    private String status;

    /**
     * 审批人ID
     */
    @TableField("approver_id")
    private Long approverId;

    /**
     * 审批意见
     */
    @TableField("approval_notes")
    private String approvalNotes;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
