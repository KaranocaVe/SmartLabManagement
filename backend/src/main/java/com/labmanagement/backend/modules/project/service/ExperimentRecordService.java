package com.labmanagement.backend.modules.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.modules.project.dto.ExperimentRecordCreateDTO;
import com.labmanagement.backend.modules.project.entity.ExperimentRecord;

/**
 * Service for ExperimentRecord.
 * 封装创建、查询实验记录的业务逻辑，可能会关联附件。
 *
 * @author Gemini
 * @since 2025-07-12
 */
public interface ExperimentRecordService extends IService<ExperimentRecord> {

    /**
     * Creates a new experiment record.
     * 创建一条新的实验记录。
     *
     * @param createDTO  The DTO containing record details.
     * @param recorderId The ID of the user creating the record.
     * @return The saved ExperimentRecord entity.
     */
    ExperimentRecord createRecord(ExperimentRecordCreateDTO createDTO, Long recorderId);
}