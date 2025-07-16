package com.labmanagement.backend.modules.system.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * 角色-权限关联表实体类
 * 描述：链接 roles 和 permissions 的多对多关系。
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
@TableName("role_permissions")
@NoArgsConstructor
@AllArgsConstructor
public class RolePermission implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 角色ID，外键关联 roles.id
     */
    @TableField("role_id")
    private Integer roleId;

    /**
     * 权限ID，外键关联 permissions.id
     */
    @TableField("permission_id")
    private Integer permissionId;
}
