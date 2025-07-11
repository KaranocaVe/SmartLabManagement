package com.labmanagement.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
// ... other annotations
public class SecurityConfig {

    // ... other beans and configurations

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 使用 BCrypt 强哈希函数，这是现代密码存储的标准
        return new BCryptPasswordEncoder();
    }
}