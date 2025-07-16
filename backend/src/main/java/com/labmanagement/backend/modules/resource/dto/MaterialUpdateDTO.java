package com.labmanagement.backend.modules.resource.dto;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for updating an existing material's information.
 * 用于更新现有物资的基础信息。注意：库存量不在此处更新。
 *
 * @author Ge
 * @since 2025-07-13
 */
@Data
public class MaterialUpdateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull(message = "物资ID不能为空")
    private Long id;

    private String name;

    private String specification;

    private String unit;

    @DecimalMin(value = "0.0", message = "预警阈值不能为负数")
    private BigDecimal lowStockThreshold;

    private String storageLocation;
}

