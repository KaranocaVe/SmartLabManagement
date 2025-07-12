package com.labmanagement.backend.modules.project.dto;


import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * View Object for displaying experiment report details.
 * 用于向前端展示实验报告的详细信息，包含当前版本内容。
 */
@Data
public class ExperimentReportVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long projectId;
    private String title;
    private Long authorId;
    private String authorName;
    private Long currentVersionId;
    private String currentVersionContent; // 当前版本的内容
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
