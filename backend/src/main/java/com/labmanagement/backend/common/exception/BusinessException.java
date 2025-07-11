package com.labmanagement.backend.common.exception;


import com.labmanagement.backend.common.enums.ResponseCode;
import lombok.Getter;

/**
 * 自定义业务异常类
 * 用于在业务处理中主动抛出预期内的错误。
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Getter
public class BusinessException extends RuntimeException {

    private final int code;

    /**
     * 使用自定义消息和状态码构造业务异常
     *
     * @param code    错误码
     * @param message 错误信息
     */
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    /**
     * 使用预定义的响应码枚举构造业务异常
     *
     * @param responseCode 响应码枚举
     */
    public BusinessException(ResponseCode responseCode) {
        super(responseCode.getMessage());
        this.code = responseCode.getCode();
    }
}
