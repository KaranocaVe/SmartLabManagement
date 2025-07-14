package com.labmanagement.backend.modules.resource.dto;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for creating a new material.
 * 用于创建新物资时，封装其基础信息。
 *
 * @author Gemini
 * @since 2025-07-13
 */
@Data
public class MaterialCreateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "物资名称不能为空")
    private String name;

    private String specification; // 规格型号，可选

    @NotBlank(message = "单位不能为空")
    private String unit; // 例如: mL, g, 个

    @NotNull(message = "低库存预警阈值不能为空")
    @DecimalMin(value = "0.0", message = "预警阈值不能为负数")
    private BigDecimal lowStockThreshold;

    private String storageLocation; // 存放位置，可选
}
