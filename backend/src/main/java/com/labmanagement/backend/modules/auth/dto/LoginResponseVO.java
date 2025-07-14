package com.labmanagement.backend.modules.auth.dto;


import com.labmanagement.backend.common.constant.SystemConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * 用户登录成功后的响应视图对象 (增强版)
 * <p>
 * 包含了前端初始化界面所需的所有核心用户信息。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-13
 */
@Data
@NoArgsConstructor
public class LoginResponseVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * JWT 访问令牌
     */
    private String accessToken;

    /**
     * 令牌类型，通常为 "Bearer"
     */
    private String tokenType = SystemConstants.JWT_TOKEN_PREFIX.trim();

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 用户名
     */
    private String username;

    /**
     * 用户真实姓名
     */
    private String realName;

    /**
     * 用户拥有的角色列表 (角色名称)
     */
    private List<String> roles;

    /**
     * 用户拥有的权限码列表
     */
    private List<String> permissions;

    /**
     * 用户email
     */
    private String email;

    /**
     * 用户手机号码
     */
    private String phone;
}