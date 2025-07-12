package com.labmanagement.backend.common.handler;

import com.labmanagement.backend.common.enums.ResponseCode;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.common.vo.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 * <p>
 * 核心职责: 捕获 Controller 层抛出的所有异常，并将其转换为统一的 API 响应格式。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-12
 */
@Slf4j
@RestControllerAdvice // 声明这是一个全局的 Controller 增强器，专门处理异常
public class GlobalExceptionHandler {

    /**
     * 处理自定义的业务异常 (BusinessException)
     * <p>
     * 这是我们主动在业务代码中抛出的、可预期的异常。
     * </p>
     *
     * @param ex 捕获到的 BusinessException
     * @return 统一的 API 响应体
     */
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // 通常业务异常返回 400 状态码
    public ApiResponse<?> handleBusinessException(BusinessException ex) {
        log.warn("业务异常: {}", ex.getMessage());
        return ApiResponse.error(ex.getCode(), ex.getMessage());
    }

    /**
     * 处理 Spring Validation 校验失败的异常 (MethodArgumentNotValidException)
     * <p>
     * 当 Controller 方法参数前使用了 @Valid 注解，且校验失败时，会抛出此异常。
     * </p>
     *
     * @param ex 捕获到的 MethodArgumentNotValidException
     * @return 统一的 API 响应体
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // 从异常中获取第一条校验失败的错误信息
        String message = ex.getBindingResult().getAllErrors().getFirst().getDefaultMessage();
        log.warn("参数校验失败: {}", message);
        return ApiResponse.error(ResponseCode.VALIDATION_ERROR.getCode(), message);
    }

    /**
     * 处理 Spring Security 权限不足的异常 (AccessDeniedException)
     * <p>
     * 当用户已认证但尝试访问其不具备权限的资源（例如，方法上有 @PreAuthorize 注解但权限不匹配）时，会抛出此异常。
     * 注意：这个处理器会覆盖我们之前定义的 CustomAccessDeniedHandler，提供更集中的处理。
     * </p>
     *
     * @param ex 捕获到的 AccessDeniedException
     * @return 统一的 API 响应体
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ApiResponse<?> handleAccessDeniedException(AccessDeniedException ex) {
        log.warn("权限不足: {}", ex.getMessage());
        return ApiResponse.error(ResponseCode.UNAUTHORIZED);
    }

    /**
     * 处理所有未被捕获的系统级异常 (Exception)
     * <p>
     * 这是最后的防线，用于捕获所有其他意料之外的异常，防止敏感的堆栈信息泄露给前端。
     * </p>
     *
     * @param ex 捕获到的 Exception
     * @return 统一的 API 响应体
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<?> handleGlobalException(Exception ex) {
        // 在服务器日志中记录完整的异常堆栈信息，以便排查问题
        log.error("系统内部发生未知异常!", ex);
        // 向前端返回一个通用的、模糊的错误提示
        return ApiResponse.error(ResponseCode.FAILURE);
    }
}