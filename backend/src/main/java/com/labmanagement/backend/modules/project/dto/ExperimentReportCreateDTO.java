package com.labmanagement.backend.modules.project.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * DTO for creating a new experiment report.
 * 用于创建新实验报告时，封装报告的基础信息和初版内容。
 */
@Data
public class ExperimentReportCreateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull(message = "所属项目ID不能为空")
    private Long projectId;

    @NotBlank(message = "报告标题不能为空")
    private String title;

    @NotBlank(message = "报告的初版内容不能为空")
    private String initialContent;
}
