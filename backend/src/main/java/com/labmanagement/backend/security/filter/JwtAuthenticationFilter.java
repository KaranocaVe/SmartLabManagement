package com.labmanagement.backend.security.filter;


import com.labmanagement.backend.common.constant.SystemConstants;
import com.labmanagement.backend.common.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
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
 * @author Ge
 * @since 2025-07-12
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String jwt = resolveToken(request);
        String username = null;

        // 1. 从 Token 中解析出用户名
        if (StringUtils.hasText(jwt) && jwtUtil.validateToken(jwt)) {
            username = jwtUtil.getUsernameFromToken(jwt);
        }

        // 2. 如果用户名存在，且当前安全上下文中没有认证信息
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 3. 调用 UserDetailsService 加载用户详情 (这里会返回我们自己的 User 实体)
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 4. 创建认证令牌，此时 Principal 就是我们完整的 User 实体
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // 5. 将认证信息设置到安全上下文中
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * 从 HttpServletRequest 中解析出 Bearer Token
     *
     * @param request HTTP 请求
     * @return 解析出的 JWT 字符串，如果不存在则返回 null
     */
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(SystemConstants.JWT_HEADER_NAME);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(SystemConstants.JWT_TOKEN_PREFIX)) {
            return bearerToken.substring(SystemConstants.JWT_TOKEN_PREFIX.length());
        }
        return null;
    }
}