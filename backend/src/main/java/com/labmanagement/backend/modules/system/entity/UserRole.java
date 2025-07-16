package com.labmanagement.backend.modules.system.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * 用户-角色关联表实体类
 * 描述：链接 users 和 roles 的多对多关系。
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
@TableName("user_roles")
@NoArgsConstructor
@AllArgsConstructor
public class UserRole implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 用户ID，外键关联 users.id
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 角色ID，外键关联 roles.id
     */
    @TableField("role_id")
    private Integer roleId;
}
