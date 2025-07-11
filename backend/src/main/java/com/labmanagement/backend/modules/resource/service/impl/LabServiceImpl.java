package com.labmanagement.backend.modules.resource.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.modules.resource.entity.Lab;
import com.labmanagement.backend.modules.resource.mapper.LabMapper;
import com.labmanagement.backend.modules.resource.service.LabService;
import org.springframework.stereotype.Service;

/**
 * Implementation of LabService.
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Service
public class LabServiceImpl extends ServiceImpl<LabMapper, Lab> implements LabService {
}