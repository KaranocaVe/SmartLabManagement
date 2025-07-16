package com.labmanagement.backend.security.handler;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.labmanagement.backend.common.enums.ResponseCode;
import com.labmanagement.backend.common.vo.ApiResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * 自定义访问被拒绝处理器
 * <p>
 * 当一个已认证的用户尝试访问其不具备权限的资源时，Spring Security 会调用此处理器。
 * 我们重写此行为，使其返回一个标准的 JSON 错误响应，而不是默认的403错误页。
 * </p>
 *
 * @author Ge
 * @since 2025-07-12
 */
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)
            throws IOException, ServletException {

        // 设置响应状态码为 403 Forbidden
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        // 设置响应内容类型为 JSON
        response.setContentType("application/json;charset=UTF-8");

        // 创建统一的API响应体
        ApiResponse<Object> apiResponse = ApiResponse.error(ResponseCode.UNAUTHORIZED);

        // 使用 ObjectMapper 将响应对象转换为 JSON 字符串并写入响应流
        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(apiResponse));
    }
}
