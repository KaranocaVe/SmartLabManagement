package com.labmanagement.backend.modules.system.dto;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * 为角色分配权限时使用的数据传输对象
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
public class AssignPermissionsToRoleDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull(message = "角色ID不能为空")
    private Integer roleId;

    /**
     * 要分配给角色的权限ID列表
     */
    private List<Integer> permissionIds;
}
