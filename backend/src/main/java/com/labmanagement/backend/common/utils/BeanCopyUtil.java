package com.labmanagement.backend.common.utils;


import org.springframework.beans.BeanUtils;

/**
 * Bean属性拷贝工具类
 * 封装Spring的BeanUtils，提供便捷的转换方法。
 *
 * @author Ge
 * @since 2025-07-11
 */
public final class BeanCopyUtil {

    /**
     * 私有构造函数，防止实例化
     */
    private BeanCopyUtil() {}

    /**
     * 将源对象的属性拷贝到目标对象
     *
     * @param source 源对象
     * @param target 目标对象
     * @param <T>    目标对象的类型
     * @return 属性拷贝后的目标对象
     */
    public static <T> T copyProperties(Object source, T target) {
        if (source == null || target == null) {
            return null;
        }
        BeanUtils.copyProperties(source, target);
        return target;
    }

    /**
     * 将源对象的属性拷贝到一个新的目标类实例中
     *
     * @param source      源对象
     * @param targetClass 目标类的Class对象
     * @param <T>         目标对象的类型
     * @return 一个包含源对象属性的新目标类实例
     */
    public static <T> T copyProperties(Object source, Class<T> targetClass) {
        if (source == null) {
            return null;
        }
        try {
            T targetInstance = targetClass.getDeclaredConstructor().newInstance();
            BeanUtils.copyProperties(source, targetInstance);
            return targetInstance;
        } catch (Exception e) {
            // 在实际项目中，这里应该记录日志
            throw new RuntimeException("创建或拷贝Bean属性时出错", e);
        }
    }
}
