package com.labmanagement.backend.modules.auth.controller;


import com.labmanagement.backend.common.utils.JwtUtil;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.auth.dto.LoginRequestDTO;
import com.labmanagement.backend.modules.auth.dto.LoginResponseVO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 认证控制器
 * <p>
 * 负责处理用户的登录认证请求。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 用户登录接口
     *
     * @param loginRequestDTO 包含用户名和密码的登录请求体
     * @return 包含 JWT 的成功响应
     */
    @PostMapping("/login")
    public ApiResponse<LoginResponseVO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {

        // 1. 创建一个未认证的 AuthenticationToken，包含用户提交的凭证
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword());

        // 2. 调用 AuthenticationManager 的 authenticate 方法，这会触发 UserDetailsServiceImpl 的加载和密码比对
        Authentication authentication = authenticationManager.authenticate(authenticationToken);

        // 3. 如果认证成功，将完整的 Authentication 对象设置到 SecurityContext 中
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 4. 使用认证成功的 Authentication 对象生成 JWT
        String jwt = jwtUtil.createToken(authentication);

        // 5. 将 JWT 封装到响应对象中并返回
        return ApiResponse.success(new LoginResponseVO(jwt));
    }
}
