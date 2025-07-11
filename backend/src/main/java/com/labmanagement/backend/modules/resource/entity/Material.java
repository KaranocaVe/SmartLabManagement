package com.labmanagement.backend.modules.resource.entity;


import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 实验物资耗材库存表实体类
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Data
@TableName("materials")
public class Material implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 物资ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 物资名称
     */
    @TableField("name")
    private String name;

    /**
     * 规格型号
     */
    @TableField("specification")
    private String specification;

    /**
     * 单位 (如: mL, g, 个)
     */
    @TableField("unit")
    private String unit;

    /**
     * 当前库存
     */
    @TableField("current_stock")
    private BigDecimal currentStock;

    /**
     * 低库存预警阈值
     */
    @TableField("low_stock_threshold")
    private BigDecimal lowStockThreshold;

    /**
     * 存放位置
     */
    @TableField("storage_location")
    private String storageLocation;

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