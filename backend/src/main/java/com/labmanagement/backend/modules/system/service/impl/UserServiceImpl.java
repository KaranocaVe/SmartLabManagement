package com.labmanagement.backend.modules.system.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.labmanagement.backend.common.dto.PageRequestDTO;
import com.labmanagement.backend.common.enums.ResponseCode;
import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.common.utils.BeanCopyUtil;
import com.labmanagement.backend.modules.system.dto.AssignRolesToUserDTO;
import com.labmanagement.backend.modules.system.dto.UserCreateDTO;
import com.labmanagement.backend.modules.system.dto.UserUpdateDTO;
import com.labmanagement.backend.modules.system.dto.UserVO;
import com.labmanagement.backend.modules.system.entity.Role;
import com.labmanagement.backend.modules.system.entity.User;
import com.labmanagement.backend.modules.system.entity.UserRole;
import com.labmanagement.backend.modules.system.mapper.UserMapper;
import com.labmanagement.backend.modules.system.service.RoleService;
import com.labmanagement.backend.modules.system.service.UserRoleService;
import com.labmanagement.backend.modules.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户管理 服务实现类
 *
 * @author Ge
 * @since 2025-07-11
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRoleService userRoleService;

    @Autowired
    private RoleService roleService; // 修改：注入 RoleService

    @Override
    @Transactional
    public UserVO createUser(UserCreateDTO userCreateDTO) {
        // 1. 检查用户名和邮箱是否已存在
        if (this.count(new LambdaQueryWrapper<User>().eq(User::getUsername, userCreateDTO.getUsername())) > 0) {
            throw new BusinessException(ResponseCode.USERNAME_ALREADY_EXISTS);
        }
        if (this.count(new LambdaQueryWrapper<User>().eq(User::getEmail, userCreateDTO.getEmail())) > 0) {
            throw new BusinessException(ResponseCode.EMAIL_ALREADY_EXISTS);
        }

        // 2. DTO -> Entity 转换
        User user = BeanCopyUtil.copyProperties(userCreateDTO, User.class);

        // 3. 密码加密
        user.setPasswordHash(passwordEncoder.encode(userCreateDTO.getPassword()));
        user.setStatus("active"); // 默认激活状态

        // 4. 保存用户
        this.save(user);

        // 5. 分配角色
        if (!CollectionUtils.isEmpty(userCreateDTO.getRoleIds())) {
            AssignRolesToUserDTO assignRolesDTO = new AssignRolesToUserDTO();
            assignRolesDTO.setUserId(user.getId());
            assignRolesDTO.setRoleIds(userCreateDTO.getRoleIds());
            assignRolesToUser(assignRolesDTO);
        }

        return getUserVoById(user.getId());
    }

    @Override
    @Transactional
    public UserVO updateUser(UserUpdateDTO userUpdateDTO) {
        User user = this.getById(userUpdateDTO.getId());
        if (user == null) {
            throw new BusinessException(ResponseCode.NOT_FOUND);
        }

        // 仅更新允许修改的字段
        BeanCopyUtil.copyProperties(userUpdateDTO, user);
        this.updateById(user);

        return getUserVoById(user.getId());
    }

    @Override
    public UserVO getUserVoById(Long userId) {
        User user = this.getById(userId);
        if (user == null) {
            return null;
        }
        UserVO userVO = BeanCopyUtil.copyProperties(user, UserVO.class);

        // 修改：通过 service 层组合调用来获取角色列表，而不是自定义 mapper 方法
        userVO.setRoles(getRoleNamesByUserId(userId));

        return userVO;
    }

    @Override
    public IPage<UserVO> getUserPage(PageRequestDTO pageRequestDTO) {
        IPage<User> userPage = this.page(new Page<>(pageRequestDTO.getPageNum(), pageRequestDTO.getPageSize()));

        return userPage.convert(user -> {
            UserVO userVO = BeanCopyUtil.copyProperties(user, UserVO.class);
            // 修改：通过 service 层组合调用来获取角色列表
            userVO.setRoles(getRoleNamesByUserId(user.getId()));
            return userVO;
        });
    }

    @Override
    @Transactional
    public void assignRolesToUser(AssignRolesToUserDTO assignRolesToUserDTO) {
        Long userId = assignRolesToUserDTO.getUserId();
        // 1. 删除用户原有的所有角色关联
        userRoleService.remove(new LambdaQueryWrapper<UserRole>().eq(UserRole::getUserId, userId));

        // 2. 添加新的角色关联
        List<Integer> roleIds = assignRolesToUserDTO.getRoleIds();
        if (!CollectionUtils.isEmpty(roleIds)) {
            List<UserRole> userRoles = roleIds.stream()
                    .map(roleId -> new UserRole(userId, roleId))
                    .collect(Collectors.toList());
            // 批量插入
            userRoleService.saveBatch(userRoles);
        }
    }

    /**
     * 根据用户ID获取角色名称列表的私有辅助方法
     *
     * @param userId 用户ID
     * @return 角色名称列表
     */
    private List<String> getRoleNamesByUserId(Long userId) {
        // 1. 根据用户ID查询关联的角色ID列表
        List<UserRole> userRoles = userRoleService.list(new LambdaQueryWrapper<UserRole>().eq(UserRole::getUserId, userId));
        if (CollectionUtils.isEmpty(userRoles)) {
            return Collections.emptyList();
        }
        List<Integer> roleIds = userRoles.stream().map(UserRole::getRoleId).collect(Collectors.toList());

        // 2. 根据角色ID列表查询角色实体列表
        List<Role> roles = roleService.listByIds(roleIds);
        if (CollectionUtils.isEmpty(roles)) {
            return Collections.emptyList();
        }

        // 3. 提取角色名称
        return roles.stream().map(Role::getRoleName).collect(Collectors.toList());
    }
}
