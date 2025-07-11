package com.labmanagement.backend.modules.system.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 权限表实体类
 * 描述：定义系统中最小粒度的操作权限，是权限控制的原子。
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Data
@TableName("permissions")
public class Permission implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 权限唯一ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 权限代码，采用 `模块:操作` 格式，如 `project:create`
     */
    @TableField("permission_code")
    private String permissionCode;

    /**
     * 对权限作用的详细描述
     */
    @TableField("description")
    private String description;

    /**
     * 该权限所属的功能模块，用于分组管理
     */
    @TableField("module")
    private String module;
}