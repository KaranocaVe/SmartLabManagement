package com.labmanagement.backend.modules.resource.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for creating a new equipment.
 * 用于创建新设备时封装基础信息。
 */
@Data
public class EquipmentCreateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "设备名称不能为空")
    private String name;

    @NotBlank(message = "资产编号不能为空")
    private String assetNumber;

    private String model;
    private Integer labId;
    private Long supplierId;
    private LocalDate purchaseDate;
    private Integer maintenanceCycleDays;
}
