package com.labmanagement.backend.common.handler;

import com.labmanagement.backend.common.enums.ResponseCode;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.common.exception.DatabaseException;
import com.labmanagement.backend.common.vo.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器 (增强版)
 * <p>
 * 核心职责: 捕获 Controller 层抛出的所有异常，并将其转换为统一的 API 响应格式。
 * </p>
 *
 * @author Ge
 * @since 2025-07-13
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * (新增) 处理所有 Spring Security 认证相关的异常 (AuthenticationException)
     * <p>
     * 这是处理登录失败等场景的核心。
     * </p>
     *
     * @param ex 捕获到的 AuthenticationException 或其子类
     * @return 统一的 API 响应体，HTTP 状态码为 401
     */
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponse<Object> handleAuthenticationException(AuthenticationException ex) {
        log.warn("认证失败: {}", ex.getMessage());
        // 使用 instanceof 而不是 pattern matching 来处理不同的异常类型
        if (ex instanceof BadCredentialsException) {
            return ApiResponse.error(ResponseCode.INVALID_CREDENTIALS);
        } else if (ex instanceof DisabledException) {
            return ApiResponse.error(ResponseCode.USER_ACCOUNT_DISABLED);
        } else if (ex instanceof LockedException) {
            return ApiResponse.error(ResponseCode.USER_ACCOUNT_LOCKED);
        } else {
            // 对于其他认证异常，返回一个通用的未认证错误
            return ApiResponse.error(ResponseCode.UNAUTHENTICATED.getCode(), ex.getMessage());
        }
    }

    /**
     * 处理自定义的业务异常 (BusinessException)
     */
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Object> handleBusinessException(BusinessException ex) {
        log.error("业务异常拦截: code={}, message={}, stack:", ex.getCode(), ex.getMessage(), ex);
        return ApiResponse.error(ex.getCode(), ex.getMessage());
    }

    /**
     * 处理 Spring Validation 校验失败的异常 (MethodArgumentNotValidException)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        log.warn("参数校验失败: {}", message);
        return ApiResponse.error(ResponseCode.VALIDATION_ERROR.getCode(), message);
    }

    /**
     * 处理 Spring Security 权限不足的异常 (AccessDeniedException)
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ApiResponse<Object> handleAccessDeniedException(AccessDeniedException ex) {
        log.warn("权限不足: {}", ex.getMessage());
        return ApiResponse.error(ResponseCode.UNAUTHORIZED);
    }

    /**
     * 处理所有未被捕获的系统级异常 (Exception)
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Object> handleGlobalException(Exception ex) {
        log.error("系统内部发生未知异常! message={}, stack=", ex.getMessage(), ex);
        return ApiResponse.error(ResponseCode.FAILURE.getCode(), ex.getMessage());
    }

    // 如果需要扩展，可以在此处添加新的异常处理逻辑
    // 例如：处理自定义的数据库异常
    @ExceptionHandler(DatabaseException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Object> handleDatabaseException(DatabaseException ex) {
        log.error("数据库异常: {}", ex.getMessage());
        return ApiResponse.error(ResponseCode.DATABASE_ERROR.getCode(), ex.getMessage());
    }
}
