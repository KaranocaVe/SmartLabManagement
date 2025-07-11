package com.labmanagement.backend.modules.resource.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 设备信息表实体类
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Data
@TableName("equipment")
public class Equipment implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 设备ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 设备名称
     */
    @TableField("name")
    private String name;

    /**
     * 资产编号
     */
    @TableField("asset_number")
    private String assetNumber;

    /**
     * 设备型号
     */
    @TableField("model")
    private String model;

    /**
     * 所属实验室ID
     */
    @TableField("lab_id")
    private Integer labId;

    /**
     * 供应商ID
     */
    @TableField("supplier_id")
    private Long supplierId;

    /**
     * 购置日期
     */
    @TableField("purchase_date")
    private LocalDate purchaseDate;

    /**
     * 设备状态: 'available', 'in_use', 'reserved', 'maintenance', 'scrapped'
     */
    @TableField("status")
    private String status;

    /**
     * 维护周期（天）
     */
    @TableField("maintenance_cycle_days")
    private Integer maintenanceCycleDays;

    /**
     * 下次维护日期
     */
    @TableField("next_maintenance_date")
    private LocalDate nextMaintenanceDate;

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