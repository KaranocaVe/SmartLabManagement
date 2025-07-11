package com.labmanagement.backend.modules.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * DTO for adding a new member to a project.
 * 用于向项目中添加新成员时，封装成员用户ID和其在项目中的角色。
 */
@Data
public class AddProjectMemberDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull(message = "项目ID不能为空")
    private Long projectId;

    @NotNull(message = "用户ID不能为空")
    private Long userId;

    @NotBlank(message = "成员在项目中的角色不能为空")
    private String roleInProject;
}