package com.labmanagement.backend.modules.resource.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ResourceRequestCreateDTO implements Serializable {
    @NotBlank(message = "请求类型不能为空")
    private String requestType; // 'equipment', 'lab', 'material'

    @NotNull(message = "资源ID不能为空")
    private Long resourceId;

    private BigDecimal quantity; // 仅物资申请时需要

    private LocalDateTime startTime; // 仅设备/场地预约时需要

    private LocalDateTime endTime; // 仅设备/场地预约时需要

    private String purpose;
}
