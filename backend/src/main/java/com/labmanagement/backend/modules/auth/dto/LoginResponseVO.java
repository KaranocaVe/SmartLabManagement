package com.labmanagement.backend.modules.auth.dto;


import com.labmanagement.backend.common.constant.SystemConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * 用户登录成功后的响应视图对象
 *
 * @author Gemini
 * @since 2025-07-12
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    public LoginResponseVO(String accessToken) {
        this.accessToken = accessToken;
    }
}