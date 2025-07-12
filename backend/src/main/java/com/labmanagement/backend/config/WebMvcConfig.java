package com.labmanagement.backend.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Spring MVC 核心配置
 * <p>
 * 主要用于配置跨域资源共享 (CORS)，允许前端应用访问后端API。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-12
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * 配置CORS规则
     *
     * @param registry CORS注册表
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 对所有路径应用规则
                .allowedOriginPatterns("*") // 允许所有来源的跨域请求 (在生产环境中应配置为具体的前端域名)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许的HTTP方法
                .allowedHeaders("*") // 允许所有请求头
                .allowCredentials(true) // 允许发送凭证 (如 cookies)
                .maxAge(3600); // 预检请求的有效期，单位为秒
    }
}
