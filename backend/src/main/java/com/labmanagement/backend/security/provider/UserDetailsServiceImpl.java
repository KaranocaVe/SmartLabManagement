package com.labmanagement.backend.security.provider;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.labmanagement.backend.modules.system.entity.User;
import com.labmanagement.backend.modules.system.mapper.PermissionMapper;
import com.labmanagement.backend.modules.system.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PermissionMapper permissionMapper;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. 从数据库查询用户实体
        User user = userMapper.selectOne(new LambdaQueryWrapper<User>().eq(User::getUsername, username));

        if (user == null) {
            throw new UsernameNotFoundException("用户 '" + username + "' 不存在。");
        }

        // 2. 查询该用户的权限码
        List<String> permissionCodes = permissionMapper.findPermissionCodesByUserId(user.getId());
        List<GrantedAuthority> authorities = permissionCodes.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        // 3. 将查询到的权限集合设置到我们自己的 User 实体中
        user.setAuthorities(authorities);

        // 4. 返回我们自己的 User 实体。因为它实现了 UserDetails 接口，所以 Spring Security 可以识别它。
        return user;
    }
}