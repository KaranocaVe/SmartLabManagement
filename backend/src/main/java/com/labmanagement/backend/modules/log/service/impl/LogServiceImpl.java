package com.labmanagement.backend.modules.log.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.common.utils.BeanCopyUtil;
import com.labmanagement.backend.modules.log.dto.AuditLogQueryDTO;
import com.labmanagement.backend.modules.log.dto.AuditLogVO;
import com.labmanagement.backend.modules.log.entity.AuditLog;
import com.labmanagement.backend.modules.log.mapper.AuditLogMapper;
import com.labmanagement.backend.modules.log.service.LogService;
import com.labmanagement.backend.modules.system.entity.User;
import com.labmanagement.backend.modules.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * Implementation of LogService.
 *
 * @author Ge
 * @since 2025-07-12
 */
@Service
public class LogServiceImpl extends ServiceImpl<AuditLogMapper, AuditLog> implements LogService {

    @Autowired
    private UserService userService;

    @Override
    public IPage<AuditLogVO> queryAuditLogs(AuditLogQueryDTO queryDTO) {
        LambdaQueryWrapper<AuditLog> wrapper = new LambdaQueryWrapper<>();

        // 构建查询条件
        wrapper.eq(queryDTO.getUserId() != null, AuditLog::getUserId, queryDTO.getUserId());
        wrapper.like(StringUtils.hasText(queryDTO.getAction()), AuditLog::getAction, queryDTO.getAction());
        wrapper.eq(StringUtils.hasText(queryDTO.getTargetType()), AuditLog::getTargetType, queryDTO.getTargetType());
        wrapper.ge(queryDTO.getStartTime() != null, AuditLog::getCreatedAt, queryDTO.getStartTime());
        wrapper.le(queryDTO.getEndTime() != null, AuditLog::getCreatedAt, queryDTO.getEndTime());

        // 按创建时间降序排序
        wrapper.orderByDesc(AuditLog::getCreatedAt);

        // 执行分页查询
        Page<AuditLog> page = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());
        IPage<AuditLog> auditLogPage = this.page(page, wrapper);

        // 转换成 VO 并填充关联数据
        return auditLogPage.convert(auditLog -> {
            AuditLogVO vo = BeanCopyUtil.copyProperties(auditLog, AuditLogVO.class);
            if (auditLog.getUserId() != null) {
                User user = userService.getById(auditLog.getUserId());
                if (user != null) {
                    vo.setUserName(user.getRealName());
                } else {
                    vo.setUserName("用户已注销");
                }
            }
            return vo;
        });
    }
}
