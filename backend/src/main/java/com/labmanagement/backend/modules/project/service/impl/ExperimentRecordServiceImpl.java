package com.labmanagement.backend.modules.project.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.common.utils.BeanCopyUtil;
import com.labmanagement.backend.modules.project.dto.ExperimentRecordCreateDTO;
import com.labmanagement.backend.modules.project.entity.ExperimentRecord;
import com.labmanagement.backend.modules.project.mapper.ExperimentRecordMapper;
import com.labmanagement.backend.modules.project.service.ExperimentRecordService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Implementation of ExperimentRecordService.
 *
 * @author Ge
 * @since 2025-07-12
 */
@Service
public class ExperimentRecordServiceImpl extends ServiceImpl<ExperimentRecordMapper, ExperimentRecord> implements ExperimentRecordService {

    @Override
    public ExperimentRecord createRecord(ExperimentRecordCreateDTO createDTO, Long recorderId) {
        ExperimentRecord record = BeanCopyUtil.copyProperties(createDTO, ExperimentRecord.class);
        record.setUserId(recorderId);
        record.setRecordTime(LocalDateTime.now());
        this.save(record);
        // In a real scenario, you might handle associated attachments here.
        // 真实场景下，您可能会在这里处理关联附件的逻辑。
        return record;
    }
}