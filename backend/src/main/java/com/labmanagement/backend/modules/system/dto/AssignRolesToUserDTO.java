package com.labmanagement.backend.modules.system.dto;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * 为用户分配角色时使用的数据传输对象
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
public class AssignRolesToUserDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull(message = "用户ID不能为空")
    private Long userId;

    /**
     * 要分配给用户的角色ID列表
     */
    private List<Integer> roleIds;
}

