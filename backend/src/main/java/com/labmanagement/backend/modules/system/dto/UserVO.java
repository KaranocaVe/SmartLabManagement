package com.labmanagement.backend.modules.system.dto;


import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 向前端返回用户信息时使用的视图对象
 * (View Object)，隐藏了密码等敏感信息。
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
public class UserVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private String username;
    private String realName;
    private String email;
    private String phone;
    private String status;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
    private List<String> roles; // 用户的角色名称列表
}
