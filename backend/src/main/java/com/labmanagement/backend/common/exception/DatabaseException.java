package com.labmanagement.backend.common.exception;

import com.labmanagement.backend.common.enums.ResponseCode;

/**
 * 自定义数据库异常
 * <p>
 * 当数据库操作（如插入、更新、删除）失败时，可以抛出此异常。
 * </p>
 *
 * @author Ge
 * @since 2025-07-15
 */
public class DatabaseException extends BusinessException {

    public DatabaseException(String message) {
        super(ResponseCode.DATABASE_ERROR.getCode(), message);
    }

    public DatabaseException(ResponseCode responseCode) {
        super(responseCode);
    }

    public DatabaseException(ResponseCode responseCode, String message) {
        super(responseCode.getCode(), message);
    }
}
