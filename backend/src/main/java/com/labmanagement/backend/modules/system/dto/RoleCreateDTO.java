package com.labmanagement.backend.modules.system.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 创建新角色时使用的数据传输对象
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
public class RoleCreateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "角色名称不能为空")
    private String roleName;

    private String description;
}
