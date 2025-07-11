package com.labmanagement.backend.common.constant;


/**
 * 系统级常量定义
 *
 * @author Gemini
 * @since 2025-07-11
 */
public final class SystemConstants {

    /**
     * 私有构造函数，防止实例化
     */
    private SystemConstants() {}

    /**
     * JWT在HTTP Header中的键名
     */
    public static final String JWT_HEADER_NAME = "Authorization";

    /**
     * JWT值的标准前缀
     */
    public static final String JWT_TOKEN_PREFIX = "Bearer ";

}