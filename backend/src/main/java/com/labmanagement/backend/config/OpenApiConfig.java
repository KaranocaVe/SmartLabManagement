package com.labmanagement.backend.config;


import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI 3 (Swagger) 配置类
 * <p>
 * 用于生成交互式的 API 文档，方便前后端联调。
 * </p>
 *
 * @author Ge
 * @since 2025-07-12
 */
@Configuration
public class OpenApiConfig {

    /**
     * 配置 OpenAPI 的基本信息和安全认证方案
     *
     * @return OpenAPI bean
     */
    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
                // 1. 配置全局的安全方案，使得API文档右上角出现 "Authorize" 按钮
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(
                        new Components()
                                .addSecuritySchemes(securitySchemeName,
                                        new SecurityScheme()
                                                .name(securitySchemeName)
                                                .type(SecurityScheme.Type.HTTP) // 类型为 HTTP
                                                .scheme("bearer") // 认证方案为 Bearer
                                                .bearerFormat("JWT") // 令牌格式为 JWT
                                )
                )
                // 2. 配置API文档的基本信息
                .info(new Info()
                        .title("智能实验室运行及管理平台 API 文档")
                        .description("本文档提供了平台后端所有可用的 RESTful API 接口。")
                        .version("v1.0")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org"))
                );
    }
}
