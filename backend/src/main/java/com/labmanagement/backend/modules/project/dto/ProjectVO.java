package com.labmanagement.backend.modules.project.dto;


import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * View Object for displaying project details.
 * 用于向前端展示项目详情，会包含项目负责人姓名、成员列表等关联信息。
 */
@Data
public class ProjectVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private String name;
    private String description;
    private Long projectLeadId;
    private String projectLeadName; // 关联查询出的项目负责人姓名
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private List<ProjectMemberVO> members; // 项目成员列表
}
