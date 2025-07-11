package com.labmanagement.backend.modules.system.service;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.labmanagement.backend.common.dto.PageRequestDTO;
import com.labmanagement.backend.modules.system.dto.AssignRolesToUserDTO;
import com.labmanagement.backend.modules.system.dto.UserCreateDTO;
import com.labmanagement.backend.modules.system.dto.UserUpdateDTO;
import com.labmanagement.backend.modules.system.dto.UserVO;
import com.labmanagement.backend.modules.system.entity.User;

/**
 * 用户管理 服务类
 *
 * @author Gemini
 * @since 2025-07-11
 */
public interface UserService extends IService<User> {

    /**
     * 创建一个新用户
     *
     * @param userCreateDTO 用户创建信息
     * @return 创建成功后的用户信息
     */
    UserVO createUser(UserCreateDTO userCreateDTO);

    /**
     * 更新用户信息
     *
     * @param userUpdateDTO 用户更新信息
     * @return 更新后的用户信息
     */
    UserVO updateUser(UserUpdateDTO userUpdateDTO);

    /**
     * 根据ID获取用户详情（包含角色信息）
     *
     * @param userId 用户ID
     * @return 用户视图对象
     */
    UserVO getUserVoById(Long userId);

    /**
     * 分页查询用户列表
     *
     * @param pageRequestDTO 分页请求参数
     * @return 分页的用户视图对象
     */
    IPage<UserVO> getUserPage(PageRequestDTO pageRequestDTO);

    /**
     * 为用户分配角色
     *
     * @param assignRolesToUserDTO 分配角色请求
     */
    void assignRolesToUser(AssignRolesToUserDTO assignRolesToUserDTO);
}