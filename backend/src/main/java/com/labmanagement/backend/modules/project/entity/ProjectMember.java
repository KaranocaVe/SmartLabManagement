package com.labmanagement.backend.modules.project.entity;


import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * 项目与成员的关联表实体类
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Data
@TableName("project_members")
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMember implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 项目ID
     */
    @TableField("project_id")
    private Long projectId;

    /**
     * 成员用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 在项目中的角色
     */
    @TableField("role_in_project")
    private String roleInProject;
}