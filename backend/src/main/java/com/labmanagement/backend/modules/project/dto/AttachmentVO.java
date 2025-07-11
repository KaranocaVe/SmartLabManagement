package com.labmanagement.backend.modules.project.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * View Object for displaying attachment details.
 * 用于展示附件信息，如文件名、大小、上传者等。
 */
@Data
public class AttachmentVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private String fileName;
    private String filePath;
    private String fileType;
    private Integer fileSize;
    private Long uploaderId;
    private String uploaderName; // 关联查询出的上传者姓名
    private LocalDateTime createdAt;
}
