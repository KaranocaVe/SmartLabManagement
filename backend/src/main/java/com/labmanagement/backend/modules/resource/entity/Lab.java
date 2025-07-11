package com.labmanagement.backend.modules.resource.entity;


import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 实验室场地信息表实体类
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Data
@TableName("labs")
public class Lab implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 实验室/场地ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 实验室名称或编号
     */
    @TableField("name")
    private String name;

    /**
     * 物理位置
     */
    @TableField("location")
    private String location;

    /**
     * 场地状态: 'available', 'in_use', 'maintenance'
     */
    @TableField("status")
    private String status;

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