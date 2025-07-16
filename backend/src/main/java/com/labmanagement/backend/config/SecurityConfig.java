package com.labmanagement.backend.config;

import com.labmanagement.backend.security.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 核心安全配置类
 * <p>
 * 这是整个安全体系的总装配与配置中心。
 * </p>
 *
 * @author Ge
 * @since 2025-07-12
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity() // 开启方法级的权限注解，如 @PreAuthorize
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private AuthenticationEntryPoint customAuthenticationEntryPoint;

    @Autowired
    private AccessDeniedHandler customAccessDeniedHandler;

    /**
     * 配置密码编码器，用于密码的加密与比对
     *
     * @return PasswordEncoder 的实例
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        // 使用 BCrypt 强哈希函数，这是现代密码存储的标准
        return new BCryptPasswordEncoder();
    }

    /**
     * 配置并暴露 AuthenticationManager，用于处理认证请求（如登录）
     *
     * @param authenticationConfiguration 认证配置
     * @return AuthenticationManager 的实例
     * @throws Exception 如果配置过程中发生错误
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * 配置 Spring Security 的过滤器链，定义核心安全策略
     *
     * @param http HttpSecurity 配置对象
     * @return SecurityFilterChain
     * @throws Exception 如果配置过程中发生错误
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. 关闭 CSRF 防护，因为我们使用 JWT，不需要 session
                .csrf(AbstractHttpConfigurer::disable)

                // 2. 配置 Session 管理策略为 STATELESS（无状态），因为我们是前后端分离项目
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 3. 配置 HTTP 请求的授权规则
                .authorizeHttpRequests(auth -> auth
                        // 放行登录接口和API文档路径，允许匿名访问
                        .requestMatchers("/api/auth/**", "/error", "/v3/api-docs/**", "/swagger-ui/**", "/doc.html").permitAll()
                        // 除上述路径外，所有其他请求都需要认证
                        .anyRequest().authenticated()
                )

                // 4. 配置自定义的异常处理器
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(customAuthenticationEntryPoint) // 处理未认证异常
                        .accessDeniedHandler(customAccessDeniedHandler)      // 处理权限不足异常
                )

                // 5. 将我们自定义的 JWT 过滤器添加到 Spring Security 的过滤器链中
                //    它会在 UsernamePasswordAuthenticationFilter 之前执行
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
