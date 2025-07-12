package com.labmanagement.backend.common.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 自定义审计日志注解
 * <p>
 * 将此注解添加到需要记录操作日志的 Controller 方法上。
 * AOP 切面会拦截带有此注解的方法，并自动记录日志。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-12
 */
@Target(ElementType.METHOD) // 此注解只能用于方法上
@Retention(RetentionPolicy.RUNTIME) // 此注解在运行时保留，以便AOP可以读取
public @interface AuditLog {

    /**
     * 对操作的描述
     * 例如: "创建新用户", "删除项目"
     */
    String description() default "";

}
