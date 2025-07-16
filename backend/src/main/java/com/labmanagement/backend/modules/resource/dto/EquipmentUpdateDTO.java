package com.labmanagement.backend.modules.resource.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for updating an existing equipment's information.
 * 用于更新现有设备的基础信息。
 *
 * @author Ge
 * @since 2025-07-13
 */
@Data
public class EquipmentUpdateDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull(message = "设备ID不能为空")
    private Long id;

    private String name;

    private String assetNumber;

    private String model;

    private Integer labId;

    private Long supplierId;

    private LocalDate purchaseDate;

    private String status; // 'available', 'in_use', 'reserved', 'maintenance', 'scrapped'

    private Integer maintenanceCycleDays;
}
