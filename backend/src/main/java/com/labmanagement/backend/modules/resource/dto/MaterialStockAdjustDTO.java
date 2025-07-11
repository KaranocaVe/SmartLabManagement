package com.labmanagement.backend.modules.resource.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for adjusting material stock (inbound or correction).
 * 用于物资入库或库存盘点调整时，封装请求数据。
 */
@Data
public class MaterialStockAdjustDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull(message = "物资ID不能为空")
    private Long materialId;

    @NotBlank(message = "变更类型不能为空")
    private String movementType; // 'inbound', 'adjustment'

    @NotNull(message = "变更数量不能为空")
    private BigDecimal quantityChange;

    private String reason; // 变更原因
}