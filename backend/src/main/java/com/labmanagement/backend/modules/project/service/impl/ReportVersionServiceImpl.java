package com.labmanagement.backend.modules.project.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.modules.project.entity.ReportVersion;
import com.labmanagement.backend.modules.project.mapper.ReportVersionMapper;
import com.labmanagement.backend.modules.project.service.ReportVersionService;
import org.springframework.stereotype.Service;

@Service
public class ReportVersionServiceImpl extends ServiceImpl<ReportVersionMapper, ReportVersion> implements ReportVersionService {
}