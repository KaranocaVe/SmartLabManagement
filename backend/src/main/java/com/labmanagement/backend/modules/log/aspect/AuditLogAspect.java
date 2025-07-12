package com.labmanagement.backend.modules.log.aspect;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.labmanagement.backend.modules.log.entity.AuditLog;
import com.labmanagement.backend.modules.log.service.LogService;
import com.labmanagement.backend.modules.system.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 审计日志 AOP 切面
 * <p>
 * 核心职责: 拦截所有带有 @AuditLog 注解的方法，并自动记录操作日志。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-12
 */
@Aspect
@Component
@Slf4j
public class AuditLogAspect {

    @Autowired
    private LogService logService;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 定义切点，拦截所有使用了 @AuditLog 注解的方法
     */
    @Pointcut("@annotation(com.labmanagement.backend.common.annotation.AuditLog)")
    public void auditLogPointcut() {
    }

    /**
     * 环绕通知，在目标方法执行前后进行日志记录
     *
     * @param joinPoint 连接点，代表被拦截的方法
     * @return 目标方法的执行结果
     * @throws Throwable 可能抛出的异常
     */
    @Around("auditLogPointcut()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        // 执行目标方法，并获取其返回值
        Object result = joinPoint.proceed();

        try {
            // 在方法成功执行后，异步记录日志
            handleLog(joinPoint);
        } catch (Exception e) {
            log.error("AOP 记录审计日志时发生异常: {}", e.getMessage(), e);
        }

        return result;
    }

    /**
     * 处理并保存日志的核心逻辑
     *
     * @param joinPoint 连接点
     */
    private void handleLog(ProceedingJoinPoint joinPoint) {
        AuditLog auditLog = new AuditLog();
        auditLog.setCreatedAt(LocalDateTime.now());

        // 1. 获取当前登录用户
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User currentUser) {
            auditLog.setUserId(currentUser.getId());
        }

        // 2. 获取 HTTP 请求信息
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            auditLog.setIpAddress(request.getRemoteAddr());
        }

        // 3. 获取方法签名和注解信息
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        com.labmanagement.backend.common.annotation.AuditLog annotation = method.getAnnotation(com.labmanagement.backend.common.annotation.AuditLog.class);
        if (annotation != null) {
            auditLog.setAction(annotation.description());
        }

        // 4. 获取目标类名和方法名 (可选，用于更详细的日志)
        // String className = joinPoint.getTarget().getClass().getName();
        // String methodName = signature.getName();
        // auditLog.setTargetType(className + "." + methodName);

        // 5. 获取请求参数并转换为 JSON
        Object[] args = joinPoint.getArgs();
        String[] paramNames = signature.getParameterNames();
        Map<String, Object> params = new HashMap<>();
        for (int i = 0; i < args.length; i++) {
            // 过滤掉一些不需要记录的参数类型
            if (!(args[i] instanceof User) && !(args[i] instanceof HttpServletRequest)) {
                params.put(paramNames[i], args[i]);
            }
        }
        try {
            auditLog.setDetails(objectMapper.writeValueAsString(params));
        } catch (JsonProcessingException e) {
            log.error("序列化审计日志参数时失败", e);
            auditLog.setDetails("参数序列化失败");
        }

        // 6. 保存日志到数据库
        logService.save(auditLog);
    }
}