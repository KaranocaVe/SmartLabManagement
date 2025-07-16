package com.labmanagement.backend;

import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 智能实验室运行及管理平台 - 主启动类
 *
 * @author Ge
 * @since 2025-07-12
 */
@SpringBootApplication
@EnableTransactionManagement // 明确开启声明式事务管理功能
@MapperScan("com.labmanagement.backend.modules.mapper") // 扫描所有 Mapper 接口
public class LabPlatformApplication {

    private static final Logger log = LoggerFactory.getLogger(LabPlatformApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(LabPlatformApplication.class, args);
        log.info("==================================================");
        log.info("==   智能实验室运行及管理平台 后端服务启动成功   ==");
        log.info("==================================================");
    }

}
