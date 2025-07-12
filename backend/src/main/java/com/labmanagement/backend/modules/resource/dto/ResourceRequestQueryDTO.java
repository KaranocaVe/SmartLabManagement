package com.labmanagement.backend.modules.resource.dto;

import com.labmanagement.backend.common.dto.PageRequestDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;
import java.io.Serializable;

/**
 * DTO for querying resource requests with filters.
 * 用于查询资源申请列表时，封装分页和筛选条件。
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ResourceRequestQueryDTO extends PageRequestDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 按状态筛选 (e.g., 'pending_approval', 'approved')
     */
    private String status;

    /**
     * 按申请类型筛选 ('equipment', 'lab', 'material')
     */
    private String requestType;
}