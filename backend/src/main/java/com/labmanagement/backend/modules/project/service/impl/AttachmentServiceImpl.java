package com.labmanagement.backend.modules.project.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.modules.project.entity.Attachment;
import com.labmanagement.backend.modules.project.mapper.AttachmentMapper;
import com.labmanagement.backend.modules.project.service.AttachmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Implementation of AttachmentService.
 *
 * @author Gemini
 * @since 2025-07-12
 */
@Service
public class AttachmentServiceImpl extends ServiceImpl<AttachmentMapper, Attachment> implements AttachmentService {

    // A simple file storage path. In a real application, this should be configured in application.yml.
    // 简单的文件存储路径。在实际应用中，应在 application.yml 中配置。
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public AttachmentServiceImpl() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    @Transactional
    public Attachment uploadAndSaveAttachment(MultipartFile file, String parentType, Long parentId, Long uploaderId) {
        // 1. Store the file on the server
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String storedFileName = UUID.randomUUID().toString() + fileExtension;
        Path targetLocation = this.fileStorageLocation.resolve(storedFileName);

        try {
            Files.copy(file.getInputStream(), targetLocation);
        } catch (IOException ex) {
            throw new BusinessException(500, "文件存储失败，请重试！");
        }

        // 2. Create and save the attachment record
        Attachment attachment = new Attachment();
        attachment.setFileName(originalFileName);
        attachment.setFilePath(targetLocation.toString());
        attachment.setFileType(file.getContentType());
        attachment.setFileSize((int) file.getSize());
        attachment.setParentType(parentType);
        attachment.setParentId(parentId);
        attachment.setUploaderId(uploaderId);

        this.save(attachment);
        return attachment;
    }
}