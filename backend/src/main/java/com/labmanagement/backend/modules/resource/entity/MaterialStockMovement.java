package com.labmanagement.backend.modules.resource.entity;


import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 物资库存流水表实体类
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
@TableName("material_stock_movements")
public class MaterialStockMovement implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 关联的物资ID
     */
    @TableField("material_id")
    private Long materialId;

    /**
     * 变更类型: 'inbound', 'outbound_request', 'adjustment'
     */
    @TableField("movement_type")
    private String movementType;

    /**
     * 变更数量(正增负减)
     */
    @TableField("quantity_change")
    private BigDecimal quantityChange;

    /**
     * 操作人ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 关联单据ID(如申领单ID)
     */
    @TableField("source_document_id")
    private Long sourceDocumentId;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}