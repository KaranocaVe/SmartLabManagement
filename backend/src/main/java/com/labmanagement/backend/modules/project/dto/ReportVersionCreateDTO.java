package com.labmanagement.backend.modules.project.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * DTO for creating a new version of an experiment report.
 * 用于为现有实验报告创建新版本时，封装新版本的内容。
 */
@Data
public class ReportVersionCreateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "新版本的内容不能为空")
    private String content;
}