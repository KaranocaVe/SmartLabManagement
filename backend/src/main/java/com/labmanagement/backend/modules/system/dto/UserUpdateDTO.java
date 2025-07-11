package com.labmanagement.backend.modules.system.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 更新用户信息时使用的数据传输对象
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Data
public class UserUpdateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull(message = "用户ID不能为空")
    private Long id;

    private String realName;

    @Email(message = "电子邮箱格式不正确")
    private String email;

    private String phone;

    /**
     * 更新用户状态: 'active', 'inactive', 'locked'
     */
    private String status;
}