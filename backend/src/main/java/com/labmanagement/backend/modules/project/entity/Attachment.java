package com.labmanagement.backend.modules.project.entity;


import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 统一附件管理表实体类
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
@TableName("attachments")
public class Attachment implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 附件ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 文件原始名称
     */
    @TableField("file_name")
    private String fileName;

    /**
     * 文件在服务器上的存储路径
     */
    @TableField("file_path")
    private String filePath;

    /**
     * 文件MIME类型
     */
    @TableField("file_type")
    private String fileType;

    /**
     * 文件大小(Bytes)
     */
    @TableField("file_size")
    private Integer fileSize;

    /**
     * 上传者ID
     */
    @TableField("uploader_id")
    private Long uploaderId;

    /**
     * 关联对象类型 (e.g., project, record)
     */
    @TableField("parent_type")
    private String parentType;

    /**
     * 关联对象ID
     */
    @TableField("parent_id")
    private Long parentId;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
