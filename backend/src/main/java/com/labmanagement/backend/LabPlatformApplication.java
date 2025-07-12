package com.labmanagement.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 智能实验室运行及管理平台 - 主启动类
 *
 * @author Gemini
 * @since 2025-07-12
 */
@SpringBootApplication
@EnableTransactionManagement // 明确开启声明式事务管理功能
//@MapperScan("com.labmanagement.backend.modules.*.mapper") // 批量扫描所有业务模块下的Mapper接口
public class LabPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(LabPlatformApplication.class, args);
        System.out.println("==================================================");
        System.out.println("==   智能实验室运行及管理平台 后端服务启动成功   ==");
//		System.out.println("==   API 文档地址: http://localhost:8080/doc.html   ==");
        System.out.println("==================================================");
    }

}
