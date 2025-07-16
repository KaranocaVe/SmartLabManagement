package com.labmanagement.backend.common.dto;


import jakarta.validation.constraints.Min;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 通用分页查询请求 DTO
 * <p>
 * 封装了所有分页查询的通用参数。
 * </p>
 *
 * @author Ge
 * @since 2025-07-11
 */
@Data
public class PageRequestDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 当前页码，默认为1
     */
    @Min(value = 1, message = "页码必须大于0")
    private long pageNum = 1;

    /**
     * 每页显示条数，默认为10
     */
    @Min(value = 1, message = "每页条数必须大于0")
    private long pageSize = 10;
}
