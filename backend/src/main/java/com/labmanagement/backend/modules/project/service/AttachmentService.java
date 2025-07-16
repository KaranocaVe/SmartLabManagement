package com.labmanagement.backend.modules.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.project.entity.Attachment;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service for Attachments.
 * 封装文件上传、保存记录到 `attachments` 表的逻辑。这是一个相对独立的通用服务。
 *
 * @author Ge
 * @since 2025-07-12
 */
public interface AttachmentService extends IService<Attachment> {

    /**
     * Handles file upload and saves attachment record to the database.
     * 处理文件上传，并将附件记录保存到数据库。
     *
     * @param file       The uploaded file.
     * @param parentType The type of the parent entity (e.g., 'project', 'record').
     * @param parentId   The ID of the parent entity.
     * @param uploaderId The ID of the user uploading the file.
     * @return The saved Attachment entity.
     */
    Attachment uploadAndSaveAttachment(MultipartFile file, String parentType, Long parentId, Long uploaderId);
}