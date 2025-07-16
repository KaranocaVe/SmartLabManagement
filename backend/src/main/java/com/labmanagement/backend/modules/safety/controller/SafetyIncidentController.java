package com.labmanagement.backend.modules.safety.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.dto.PageRequestDTO;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.safety.dto.SafetyIncidentCreateDTO;
import com.labmanagement.backend.modules.safety.dto.SafetyIncidentVO;
import com.labmanagement.backend.modules.safety.service.SafetyIncidentService;
import com.labmanagement.backend.modules.system.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 安全事故记录控制器
 *
 * @author Ge
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/safety-incidents")
public class SafetyIncidentController {

    @Autowired
    private SafetyIncidentService safetyIncidentService;

    /**
     * 上报一起新的安全事故
     *
     * @param createDTO   安全事故的创建信息
     * @param currentUser 当前登录用户
     * @return 记录后的安全事故视图对象
     */
    @PostMapping
    @PreAuthorize("hasAuthority('safety:log_incident')")
    @AuditLog(description = "上报安全事故")
    public ApiResponse<SafetyIncidentVO> recordIncident(
            @Valid @RequestBody SafetyIncidentCreateDTO createDTO,
            @AuthenticationPrincipal User currentUser) {

        SafetyIncidentVO recordedIncident = safetyIncidentService.recordIncident(createDTO, currentUser.getId());
        return ApiResponse.success(recordedIncident);
    }

    /**
     * 获取单个安全事故的详情
     *
     * @param id 安全事故ID
     * @return 安全事故的详细视图对象
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('safety:log_incident')") // 假设只有特定权限者能查看详情
    public ApiResponse<SafetyIncidentVO> getIncidentById(@PathVariable Long id) {
        SafetyIncidentVO incidentDetails = safetyIncidentService.getIncidentDetails(id);
        return ApiResponse.success(incidentDetails);
    }

    /**
     * 分页查询所有安全事故记录
     *
     * @param pageRequestDTO 分页参数
     * @return 分页的安全事故列表
     */
    @GetMapping
    @PreAuthorize("hasAuthority('safety:log_incident')")
    public ApiResponse<IPage<SafetyIncidentVO>> getIncidentPage(@Valid PageRequestDTO pageRequestDTO) {
        IPage<SafetyIncidentVO> page = safetyIncidentService.page(new Page<>(pageRequestDTO.getPageNum(), pageRequestDTO.getPageSize()))
                .convert(incident -> safetyIncidentService.getIncidentDetails(incident.getId()));
        return ApiResponse.success(page);
    }
}