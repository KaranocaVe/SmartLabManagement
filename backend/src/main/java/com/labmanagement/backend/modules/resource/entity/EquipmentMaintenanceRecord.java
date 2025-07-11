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
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 设备维护历史记录表实体类
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Data
@TableName("equipment_maintenance_records")
public class EquipmentMaintenanceRecord implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 关联的设备ID
     */
    @TableField("equipment_id")
    private Long equipmentId;

    /**
     * 维护日期
     */
    @TableField("maintenance_date")
    private LocalDate maintenanceDate;

    /**
     * 维护类型: 'scheduled', 'repair'
     */
    @TableField("type")
    private String type;

    /**
     * 维护内容描述
     */
    @TableField("description")
    private String description;

    /**
     * 维护人员
     */
    @TableField("technician")
    private String technician;

    /**
     * 费用
     */
    @TableField("cost")
    private BigDecimal cost;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
