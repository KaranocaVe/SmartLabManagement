package com.labmanagement.backend.modules.project.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.common.enums.ResponseCode;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.common.utils.BeanCopyUtil;
import com.labmanagement.backend.modules.project.dto.ExperimentReportCreateDTO;
import com.labmanagement.backend.modules.project.dto.ExperimentReportVO;
import com.labmanagement.backend.modules.project.entity.ExperimentReport;
import com.labmanagement.backend.modules.project.entity.ReportVersion;
import com.labmanagement.backend.modules.project.mapper.ExperimentReportMapper;
import com.labmanagement.backend.modules.project.service.ExperimentReportService;
import com.labmanagement.backend.modules.project.service.ReportVersionService;
import com.labmanagement.backend.modules.system.entity.User;
import com.labmanagement.backend.modules.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of ExperimentReportService.
 *
 * @author Ge
 * @since 2025-07-12
 */
@Service
public class ExperimentReportServiceImpl extends ServiceImpl<ExperimentReportMapper, ExperimentReport> implements ExperimentReportService {

    @Autowired
    private ReportVersionService reportVersionService;
    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public ExperimentReportVO createReport(ExperimentReportCreateDTO createDTO, Long authorId) {
        // 1. 创建报告主实体
        ExperimentReport report = new ExperimentReport();
        report.setProjectId(createDTO.getProjectId());
        report.setTitle(createDTO.getTitle());
        report.setAuthorId(authorId);
        report.setStatus("draft");
        this.save(report); // 保存后，report对象会获得数据库生成的ID

        // 2. 创建报告的第一个版本
        ReportVersion firstVersion = new ReportVersion();
        firstVersion.setReportId(report.getId());
        firstVersion.setVersionNumber("v1.0");
        firstVersion.setContent(createDTO.getInitialContent());
        firstVersion.setModifierId(authorId);
        reportVersionService.save(firstVersion);

        // 3. 更新报告主实体，关联当前版本ID
        report.setCurrentVersionId(firstVersion.getId());
        this.updateById(report);

        return getReportDetails(report.getId());
    }

    @Override
    @Transactional
    public ExperimentReportVO createNewVersion(Long reportId, String newContent, Long modifierId) {
        ExperimentReport report = this.getById(reportId);
        if (report == null) {
            throw new BusinessException(ResponseCode.NOT_FOUND.getCode(), "报告不存在");
        }

        // 1. 创建新版本
        long currentVersionCount = reportVersionService.count(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<ReportVersion>()
                        .eq(ReportVersion::getReportId, reportId)
        );
        ReportVersion newVersion = new ReportVersion();
        newVersion.setReportId(reportId);
        newVersion.setVersionNumber("v" + (currentVersionCount + 1) + ".0");
        newVersion.setContent(newContent);
        newVersion.setModifierId(modifierId);
        reportVersionService.save(newVersion);

        // 2. 更新报告主实体的当前版本ID
        report.setCurrentVersionId(newVersion.getId());
        this.updateById(report);

        return getReportDetails(reportId);
    }

    @Override
    public ExperimentReportVO getReportDetails(Long reportId) {
        ExperimentReport report = this.getById(reportId);
        if (report == null) return null;

        ExperimentReportVO vo = BeanCopyUtil.copyProperties(report, ExperimentReportVO.class);

        // 填充作者姓名
        User author = userService.getById(report.getAuthorId());
        if (author != null) vo.setAuthorName(author.getRealName());

        // 填充当前版本内容
        if (report.getCurrentVersionId() != null) {
            ReportVersion currentVersion = reportVersionService.getById(report.getCurrentVersionId());
            if (currentVersion != null) vo.setCurrentVersionContent(currentVersion.getContent());
        }
        return vo;
    }
}