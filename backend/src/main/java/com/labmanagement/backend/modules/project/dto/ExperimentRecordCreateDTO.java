package com.labmanagement.backend.modules.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * DTO for creating a new experiment record.
 * 用于创建新的实验记录，封装实验内容、关联任务等。
 */
@Data
public class ExperimentRecordCreateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull(message = "所属项目ID不能为空")
    private Long projectId;

    private Long taskId; // 关联的任务ID，可选

    @NotBlank(message = "实验记录内容不能为空")
    private String content;

    private String structuredData; // JSON格式的结构化数据，可选
}