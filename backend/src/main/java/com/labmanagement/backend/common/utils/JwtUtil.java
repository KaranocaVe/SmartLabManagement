package com.labmanagement.backend.common.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;
import java.util.stream.Stream;


/**
 * JWT 工具类
 * 封装 JWT 的生成、解析和验证逻辑。
 *
 * @author Ge
 * @since 2025-07-12
 */
@Slf4j
@Component
public class JwtUtil {

    private static final String AUTHORITIES_KEY = "auth";
    /**
     * 从 application.yml 读取 JWT 密钥
     */
    @Value("${jwt.secret}")
    private String secret;
    /**
     * 从 application.yml 读取 JWT 过期时间（毫秒）
     */
    @Value("${jwt.expiration}")
    private long expiration;
    private Key key;

    /**
     * 在构造函数执行后，初始化密钥
     */
    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 根据认证信息创建 JWT
     *
     * @param authentication Spring Security 的认证对象
     * @return 生成的 JWT 字符串
     */
    public String createToken(Authentication authentication) {
        // 从认证信息中获取权限列表
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        long now = (new Date()).getTime();
        Date validity = new Date(now + this.expiration);

        return Jwts.builder().subject(authentication.getName()) // 将用户名放入 subject
                .claim(AUTHORITIES_KEY, authorities) // 将权限信息放入 claim
                .signWith(key, SignatureAlgorithm.HS512).expiration(validity) // 设置过期时间
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser().setSigningKey(key).build().parseSignedClaims(token).getPayload().getSubject();
    }

    /**
     * 从 JWT 中解析出认证信息
     *
     * @param token JWT 字符串
     * @return Spring Security 的认证对象
     */
    public Authentication getAuthentication(String token) {
        // 解析 JWT 的 claims
        Claims claims = Jwts.parser().setSigningKey(key)
                .build().parseSignedClaims(token).getPayload();

        // 从 claims 中获取权限字符串，并转换为 GrantedAuthority 集合
        Collection<? extends GrantedAuthority> authorities =
                Stream.of(claims.get(AUTHORITIES_KEY).toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        // 创建 UserDetails 对象
        UserDetails principal = new User(claims.getSubject(), "", authorities);

        // 创建并返回 Authentication 对象
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    /**
     * 验证 JWT 是否有效
     *
     * @param authToken JWT 字符串
     * @return 如果有效返回 true，否则返回 false
     */
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.info("Invalid JWT token.");
            log.trace("Invalid JWT token trace.", e);
        }
        return false;
    }

}