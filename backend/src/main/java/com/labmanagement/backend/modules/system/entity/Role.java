package com.labmanagement.backend.modules.system.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 角色表实体类
 * 描述：定义用户的一组权限集合，如管理员、教师等。
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
@TableName("roles")
public class Role implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 角色唯一ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 角色名称，必须唯一
     */
    @TableField("role_name")
    private String roleName;

    /**
     * 对角色的功能进行简要描述
     */
    @TableField("description")
    private String description;
}