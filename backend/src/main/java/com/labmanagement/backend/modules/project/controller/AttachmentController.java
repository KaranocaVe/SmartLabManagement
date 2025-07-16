package com.labmanagement.backend.modules.project.controller;


import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.utils.BeanCopyUtil;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.project.dto.AttachmentVO;
import com.labmanagement.backend.modules.project.entity.Attachment;
import com.labmanagement.backend.modules.project.service.AttachmentService;
import com.labmanagement.backend.modules.system.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * 附件管理控制器
 * <p>
 * 核心职责: 管理附件的上传和关联。
 * </p>
 *
 * @author Ge
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/attachments")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    /**
     * 统一文件上传接口
     * <p>
     * 上传文件后，返回包含数据库ID和文件路径的附件信息。
     * 前端在创建其他业务（如实验记录）时，再将这个附件ID关联过去。
     * </p>
     *
     * @param file        上传的文件 (multipart/form-data)
     * @param parentType  关联的父实体类型 (例如: 'project', 'record')
     * @param parentId    关联的父实体ID
     * @param currentUser 当前登录用户
     * @return 包含附件详细信息的视图对象
     */
    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    @AuditLog(description = "上传文件附件")
    public ApiResponse<AttachmentVO> uploadAttachment(
            @RequestParam("file") MultipartFile file,
            @RequestParam("parentType") String parentType,
            @RequestParam("parentId") Long parentId,
            @AuthenticationPrincipal User currentUser) {

        // 调用服务层处理文件存储和数据库记录
        Attachment savedAttachment = attachmentService.uploadAndSaveAttachment(file, parentType, parentId, currentUser.getId());

        // 将实体转换为VO，并填充上传者姓名后返回给前端
        AttachmentVO vo = BeanCopyUtil.copyProperties(savedAttachment, AttachmentVO.class);
        vo.setUploaderName(currentUser.getRealName());

        return ApiResponse.success(vo);
    }
}
