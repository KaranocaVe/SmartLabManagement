package com.labmanagement.backend.modules.system.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.labmanagement.backend.common.annotation.AuditLog;
import com.labmanagement.backend.common.dto.PageRequestDTO;
import com.labmanagement.backend.common.vo.ApiResponse;
import com.labmanagement.backend.modules.system.dto.AssignRolesToUserDTO;
import com.labmanagement.backend.modules.system.dto.UserCreateDTO;
import com.labmanagement.backend.modules.system.dto.UserUpdateDTO;
import com.labmanagement.backend.modules.system.dto.UserVO;
import com.labmanagement.backend.modules.system.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * 用户管理控制器
 * 提供对用户的增、删、改、查等全套 RESTful 接口。
 *
 * @author Gemini
 * @since 2025-07-12
 */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    @PreAuthorize("hasAuthority('user:create')")
    @AuditLog(description = "创建新用户")
    public ApiResponse<UserVO> createUser(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        UserVO createdUser = userService.createUser(userCreateDTO);
        return ApiResponse.success(createdUser);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('user:edit')")
    @AuditLog(description = "更新用户信息")
    public ApiResponse<UserVO> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        userUpdateDTO.setId(id);
        UserVO updatedUser = userService.updateUser(userUpdateDTO);
        return ApiResponse.success(updatedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('user:delete')")
    @AuditLog(description = "删除用户")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        userService.removeById(id);
        return ApiResponse.success();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('user:view')")
    public ApiResponse<UserVO> getUserById(@PathVariable Long id) {
        UserVO userVO = userService.getUserVoById(id);
        return ApiResponse.success(userVO);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('user:view')")
    public ApiResponse<IPage<UserVO>> getUserPage(@Valid PageRequestDTO pageRequestDTO) {
        IPage<UserVO> userPage = userService.getUserPage(pageRequestDTO);
        return ApiResponse.success(userPage);
    }

    @PostMapping("/assign-roles")
    @PreAuthorize("hasAuthority('role:assign')")
    @AuditLog(description = "为用户分配角色")
    public ApiResponse<Void> assignRolesToUser(@Valid @RequestBody AssignRolesToUserDTO assignRolesToUserDTO) {
        userService.assignRolesToUser(assignRolesToUserDTO);
        return ApiResponse.success();
    }
}
