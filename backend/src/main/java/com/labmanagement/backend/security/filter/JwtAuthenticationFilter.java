package com.labmanagement.backend.security.filter;


import com.labmanagement.backend.common.constant.SystemConstants;
import com.labmanagement.backend.common.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT 认证过滤器
 * <p>
 * 这个过滤器会在每个请求到达 Controller 之前执行一次。
 * 它的核心职责是检查请求头中是否存在有效的 JWT，如果存在，就解析它并为该请求建立安全上下文。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-12
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 从请求中解析出 JWT
        String jwt = resolveToken(request);

        // 2. 验证 JWT 是否存在且有效
        if (StringUtils.hasText(jwt) && jwtUtil.validateToken(jwt)) {
            // 3. 如果有效，从中获取认证信息
            Authentication authentication = jwtUtil.getAuthentication(jwt);
            // 4. 将认证信息设置到 Spring Security 的上下文中
            //    这样，后续的安全检查（如 @PreAuthorize）就可以基于这个上下文进行。
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 5. 放行请求，让它继续在过滤器链中传递
        filterChain.doFilter(request, response);
    }

    /**
     * 从 HttpServletRequest 中解析出 Bearer Token
     *
     * @param request HTTP 请求
     * @return 解析出的 JWT 字符串，如果不存在则返回 null
     */
    private String resolveToken(HttpServletRequest request) {
        // 从 "Authorization" 请求头中获取令牌
        String bearerToken = request.getHeader(SystemConstants.JWT_HEADER_NAME);

        // 检查令牌是否存在，并且是否以 "Bearer " 开头
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(SystemConstants.JWT_TOKEN_PREFIX)) {
            // 截取并返回真正的 JWT 部分
            return bearerToken.substring(SystemConstants.JWT_TOKEN_PREFIX.length());
        }

        return null;
    }
}