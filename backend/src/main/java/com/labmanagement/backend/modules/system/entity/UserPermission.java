package com.labmanagement.backend.modules.system.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户-权限特别授权表实体类
 * 描述：授予用户独立的临时或特殊权限。
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Data
@TableName("user_permissions")
public class UserPermission implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 用户ID，外键关联 users.id
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 权限ID，外键关联 permissions.id
     */
    @TableField("permission_id")
    private Integer permissionId;

    /**
     * 权限的过期时间，NULL 表示永不过期
     */
    @TableField("expires_at")
    private LocalDateTime expiresAt;

    /**
     * 授权人ID，外键关联 users.id
     */
    @TableField("granted_by_user_id")
    private Long grantedByUserId;
}

