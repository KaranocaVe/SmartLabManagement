package com.labmanagement.backend.modules.system.entity;

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
 * 用户表实体类
 * 描述：存储所有系统用户的核心信息，是所有操作的主体。
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Data
@TableName("users")
public class User implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 唯一标识符，主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 用户的登录名，如学号/工号，必须唯一
     */
    @TableField("username")
    private String username;

    /**
     * 使用 bcrypt 或 Argon2 哈希后的密码，绝不能明文存储
     */
    @TableField("password_hash")
    private String passwordHash;

    /**
     * 用户的真实姓名
     */
    @TableField("real_name")
    private String realName;

    /**
     * 电子邮箱，用于通知和密码重置，必须唯一
     */
    @TableField("email")
    private String email;

    /**
     * 手机号码
     */
    @TableField("phone")
    private String phone;

    /**
     * 账户状态：'active'-活跃, 'inactive'-未激活/禁用, 'locked'-锁定
     */
    @TableField("status")
    private String status;

    /**
     * 用于 TOTP 的多因素认证密钥
     */
    @TableField("mfa_secret")
    private String mfaSecret;

    /**
     * 用户最后一次成功登录的时间
     */
    @TableField("last_login_at")
    private LocalDateTime lastLoginAt;

    /**
     * 记录创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    /**
     * 记录最后更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
