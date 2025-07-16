package com.labmanagement.backend.common.enums;

import lombok.Getter;

/**
 * API 响应状态码枚举
 *
 * @author Ge
 * @since 2025-07-11
 */
@Getter
public enum ResponseCode {

    // --- 通用成功 ---
    SUCCESS(200, "操作成功"),

    // --- 通用失败 ---
    FAILURE(500, "操作失败"),
    VALIDATION_ERROR(400, "参数校验失败"),
    NOT_FOUND(404, "资源未找到"),

    // --- 认证与授权 (1000-1999) ---
    UNAUTHENTICATED(1001, "用户未认证或认证已过期"),
    UNAUTHORIZED(1002, "权限不足"),
    INVALID_CREDENTIALS(1003, "用户名或密码错误"),
    USER_ACCOUNT_LOCKED(1004, "用户账户已被锁定"),
    USER_ACCOUNT_DISABLED(1005, "用户账户已被禁用"),

    // --- 业务相关 (2000-2999) ---
    USERNAME_ALREADY_EXISTS(2001, "用户名已存在"),
    EMAIL_ALREADY_EXISTS(2002, "电子邮箱已存在"),
    ROLE_NOT_FOUND(2003, "指定的角色不存在"),
    PROJECT_LEAD_NOT_FOUND(2004, "指定的项目负责人不存在"),
    INSUFFICIENT_STOCK(2005, "物资库存不足"),

    // --- 数据库错误 (3000-3999) ---
    DATABASE_ERROR(3001, "数据库操作异常");


    private final int code;
    private final String message;

    ResponseCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
