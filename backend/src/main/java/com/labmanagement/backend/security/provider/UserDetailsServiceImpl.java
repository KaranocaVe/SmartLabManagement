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

/**
 * 用户详情服务实现类
 * <p>
 * 实现 Spring Security 的 UserDetailsService 接口，用于在用户认证时加载用户数据。
 * </p>
 *
 * @author Gemini
 * @since 2025-07-12
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PermissionMapper permissionMapper;

    /**
     * 根据用户名加载用户认证信息
     * <p>
     * Spring Security 在进行密码验证时会自动调用此方法。
     * </p>
     *
     * @param username 用户登录时输入的用户名
     * @return 一个包含用户名、哈希密码和权限列表的 UserDetails 对象
     * @throws UsernameNotFoundException 如果用户不存在，则抛出此异常
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. 根据用户名从数据库查询用户
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, username);
        User user = userMapper.selectOne(queryWrapper);

        // 2. 如果用户不存在，抛出标准异常
        if (user == null) {
            throw new UsernameNotFoundException("用户 '" + username + "' 不存在。");
        }

        // 3. 查询该用户的所有权限码
        //    注意: findPermissionCodesByUserId 是一个自定义的 Mapper 方法，
        //    需要在 PermissionMapper.xml 中通过多表连接查询实现。
        List<String> permissionCodes = permissionMapper.findPermissionCodesByUserId(user.getId());

        // 4. 将权限码字符串列表转换为 Spring Security 所需的 GrantedAuthority 集合
        List<GrantedAuthority> authorities = permissionCodes.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        // 5. 构建并返回 Spring Security 的 User 对象
        //    构造函数参数：用户名, 密码(必须是数据库中存储的哈希值), 账户是否启用, 账户是否未过期, 凭证是否未过期, 账户是否未锁定, 权限集合
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                "active".equals(user.getStatus()), // isEnabled
                true, // isAccountNonExpired
                true, // isCredentialsNonExpired
                !"locked".equals(user.getStatus()), // isAccountNonLocked
                authorities
        );
    }
}