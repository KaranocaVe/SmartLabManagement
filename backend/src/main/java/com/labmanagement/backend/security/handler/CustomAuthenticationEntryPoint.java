package com.labmanagement.backend.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.labmanagement.backend.common.enums.ResponseCode;
import com.labmanagement.backend.common.vo.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * 自定义认证入口点
 * <p>
 * 当一个未认证的用户尝试访问需要权限的资源时，Spring Security 会调用此处理器。
 * 我们重写此行为，使其返回一个标准的 JSON 错误响应，而不是默认的登录页面或401错误页。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-12
 */
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {

        // 设置响应状态码为 401 Unauthorized
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        // 设置响应内容类型为 JSON
        response.setContentType("application/json;charset=UTF-8");

        // 创建统一的API响应体
        ApiResponse<Object> apiResponse = ApiResponse.error(ResponseCode.UNAUTHENTICATED);

        // 使用 ObjectMapper 将响应对象转换为 JSON 字符串并写入响应流
        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(apiResponse));
    }
}