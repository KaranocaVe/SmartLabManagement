
package com.labmanagement.backend.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * MyBatis-Plus 核心配置文件
 *
 * @author Ge
 * @since 2025-07-11
 */
@Configuration
@EnableTransactionManagement // 开启声明式事务管理
@MapperScan("com.labmanagement.backend.modules.*.mapper") // 批量扫描所有模块下的Mapper接口
public class MybatisPlusConfig {

    /**
     * 配置 MyBatis-Plus 插件集合
     *
     * @return MybatisPlusInterceptor
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();

        // 1. 添加分页插件
        // 参数指定数据库类型为 MySQL
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));

        // 如果未来需要，可以在这里添加其他插件，例如：
        // 2. 乐观锁插件 OptimisticLockerInnerInterceptor
        // 3. 防止全表更新与删除插件 BlockAttackInnerInterceptor

        return interceptor;
    }
}