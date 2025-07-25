package com.labmanagement.backend.modules.project.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

// (这是一个辅助VO，用于在ProjectVO中展示成员信息)
@Data
public class ProjectMemberVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private Long userId;
    private String memberName; // 将 realName 修改为 memberName 以保持一致性
    private String roleInProject;
}
