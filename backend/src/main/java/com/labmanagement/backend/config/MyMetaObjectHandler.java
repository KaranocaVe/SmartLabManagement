package com.labmanagement.backend.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * MyBatis-Plus 元数据对象处理器
 * <p>
 * 负责自动填充实体类中的公共字段，如 'createdAt' 和 'updatedAt'。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-11
 */
@Slf4j
@Component // 将该处理器注册为Spring Bean
public class MyMetaObjectHandler implements MetaObjectHandler {

    /**
     * 在执行插入操作时，自动填充字段
     *
     * @param metaObject 元数据对象
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        log.info("start insert fill ....");
        // setFieldValByName 方法会根据字段名自动设置值
        // 第一个参数：字段名 (与实体类中的属性名一致)
        // 第二个参数：要填充的值
        // 第三个参数：元数据对象
        this.setFieldValByName("createdAt", LocalDateTime.now(), metaObject);
        this.setFieldValByName("updatedAt", LocalDateTime.now(), metaObject);
    }

    /**
     * 在执行更新操作时，自动填充字段
     *
     * @param metaObject 元数据对象
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        log.info("start update fill ....");
        this.setFieldValByName("updatedAt", LocalDateTime.now(), metaObject);
    }
}
