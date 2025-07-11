package com.labmanagement.backend.modules.log.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.labmanagement.backend.modules.log.entity.AuditLog;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户操作审计日志表 Mapper 接口
 * <p>
 * 通过继承 BaseMapper，该接口自动拥有了对 AuditLog 实体的常用 CRUD（增删改查）方法。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Mapper
public interface AuditLogMapper extends BaseMapper<AuditLog> {

    // 如果未来有复杂的、需要手写 SQL 的查询（例如：按条件生成审计报表），
    // 可以在这里定义方法，并在对应的 XML 文件中实现。
    // 例如: List<AuditReportVO> getAuditReport(ReportQueryDTO query);

}