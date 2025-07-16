package com.labmanagement.backend.modules.auth.controller;


import com.labmanagement.backend.common.utils.JwtUtil;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.auth.dto.LoginRequestDTO;
import com.labmanagement.backend.modules.auth.dto.LoginResponseVO;
import com.labmanagement.backend.modules.system.dto.UserVO;
import com.labmanagement.backend.modules.system.entity.User;
import com.labmanagement.backend.modules.system.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;



    /**
     * 认证控制器 (已更新)
     * <p>
     * 负责处理用户的登录认证请求，并返回包含完整用户信息的响应。
     * </p>
     *
     * @author Ge
     * @since 2025-07-13
     */
    @RestController
    @RequestMapping("/api/auth")
    public class AuthController {

        @Autowired
        private AuthenticationManager authenticationManager;

        @Autowired
        private JwtUtil jwtUtil;

        @Autowired
        private UserService userService;

        /**
         * 用户登录接口
         *
         * @param loginRequestDTO 包含用户名和密码的登录请求体
         * @return 包含 JWT 和完整用户信息的成功响应
         */
        @PostMapping("/login")
        public ApiResponse<LoginResponseVO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {

            // 1. 创建认证令牌并进行认证
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword())
            );

            // 2. 将认证信息设置到安全上下文中
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 3. 从认证信息中获取我们的 User 实体
            User currentUser = (User) authentication.getPrincipal();

            // 4. 生成 JWT
            String jwt = jwtUtil.createToken(authentication);

            // 5. 准备完整的响应数据
            LoginResponseVO loginResponse = new LoginResponseVO();
            loginResponse.setAccessToken(jwt);
            loginResponse.setUserId(currentUser.getId());
            loginResponse.setUsername(currentUser.getUsername());
            loginResponse.setRealName(currentUser.getRealName());
            loginResponse.setEmail(currentUser.getEmail());
            loginResponse.setPhone(currentUser.getPhone());

            // 5.1 获取角色列表
            UserVO userVO = userService.getUserVoById(currentUser.getId());
            loginResponse.setRoles(userVO.getRoles());

            // 5.2 获取权限码列表
            List<String> permissions = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            loginResponse.setPermissions(permissions);

            // 6. 返回封装好的响应
            return ApiResponse.success(loginResponse);
        }
    }

