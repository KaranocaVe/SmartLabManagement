package com.labmanagement.backend;


import com.labmanagement.backend.common.exception.BusinessException;
import com.labmanagement.backend.modules.system.dto.UserCreateDTO;
import com.labmanagement.backend.modules.system.dto.UserVO;
import com.labmanagement.backend.modules.system.entity.User;
import com.labmanagement.backend.modules.system.mapper.UserMapper;
import com.labmanagement.backend.modules.system.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * 单元测试综合示例
 * <p>
 * 这个类集中展示了如何对 Service 层和 Controller 层进行单元测试。
 * </p>
 */
@SpringBootTest // 启动一个完整的 Spring Boot 应用上下文用于测试
@AutoConfigureMockMvc // 自动配置 MockMvc，用于模拟HTTP请求
@Transactional // 每个测试方法执行完毕后，对数据库的操作都会回滚，保证测试之间互不影响
public class ComprehensiveTests {

	// ===================================================================
	// Section 1: Service 层单元测试 (UserService)
	// 核心思想：使用 @MockBean 来“模拟”Mapper层的行为，专注于测试 Service 层的业务逻辑是否正确。
	// ===================================================================

	@Autowired
	private UserService userService;

	@MockBean // 创建一个 UserMapper 的模拟对象，它不会真正访问数据库
	private UserMapper userMapper;

	@MockBean // 同样模拟 PasswordEncoder
	private PasswordEncoder passwordEncoder;

	private UserCreateDTO userCreateDTO;

	@BeforeEach
	void setUp() {
		// 在每个测试方法执行前，准备好测试数据
		userCreateDTO = new UserCreateDTO();
		userCreateDTO.setUsername("testuser");
		userCreateDTO.setPassword("password123");
		userCreateDTO.setRealName("测试用户");
		userCreateDTO.setEmail("test@example.com");
	}

	@Test
	@DisplayName("【服务层】测试创建用户 - 成功场景")
	void testCreateUser_Success() {
		// 1. 设定模拟行为 (Arrange)
		// 当调用 userMapper.selectOne 检查用户是否存在时，返回 null (表示用户不存在)
		when(userMapper.selectOne(any())).thenReturn(null);
		// 当调用 passwordEncoder.encode 对任意字符串加密时，返回一个固定的加密串
		when(passwordEncoder.encode(any(String.class))).thenReturn("hashed_password");

		// 2. 执行被测试的业务逻辑 (Act)
		UserVO resultVO = userService.createUser(userCreateDTO);

		// 3. 验证结果 (Assert)
		assertNotNull(resultVO); // 验证返回结果不为 null
		assertEquals("testuser", resultVO.getUsername()); // 验证用户名是否正确
		Mockito.verify(userMapper, Mockito.times(1)).insert(any(User.class)); // 验证 userMapper 的 insert 方法是否被调用了且仅调用一次
	}

	@Test
	@DisplayName("【服务层】测试创建用户 - 失败场景 (用户名已存在)")
	void testCreateUser_UsernameExists() {
		// 1. 设定模拟行为 (Arrange)
		// 当调用 userMapper.selectOne 检查用户是否存在时，返回一个已存在的 User 对象
		when(userMapper.selectOne(any())).thenReturn(new User());

		// 2. & 3. 执行并验证 (Act & Assert)
		// 使用 assertThrows 来验证当执行 createUser 时，是否会抛出我们预期的 BusinessException
		assertThrows(BusinessException.class, () -> {
			userService.createUser(userCreateDTO);
		});
	}

//
//	// ===================================================================
//	// Section 2: Controller 层单元测试 (UserController)
//	// 核心思想：使用 MockMvc 来模拟真实的 HTTP 请求，并使用 @MockBean 来模拟 Service 层的行为。
//	// 这样我们就可以在不启动真实服务器、不访问真实数据库的情况下，测试 Controller 的接口逻辑、参数校验和权限控制。
//	// ===================================================================
//
//	@Autowired
//	private MockMvc mockMvc; // 用于模拟 HTTP 请求的对象
//
//	@MockBean // 模拟 UserService，使其不执行真实的业务逻辑
//	private UserService mockedUserService;
//
//	@Autowired
//	private ObjectMapper objectMapper; // 用于将 Java 对象序列化为 JSON 字符串
//
//	@Test
//	@DisplayName("【接口层】测试获取单个用户 - 成功场景 (有权限)")
//	@WithMockUser(authorities = "user:view") // 模拟一个已登录且拥有 'user:view' 权限的用户
//	void testGetUserById_Success() throws Exception {
//		// 1. 设定模拟行为 (Arrange)
//		UserVO sampleUserVO = new UserVO();
//		sampleUserVO.setId(1L);
//		sampleUserVO.setUsername("admin");
//		sampleUserVO.setRealName("超级管理员");
//		// 当调用 mockedUserService.getUserVoById(1L) 时，返回我们准备好的 sampleUserVO
//		when(mockedUserService.getUserVoById(1L)).thenReturn(sampleUserVO);
//
//		// 2. 执行并验证 (Act & Assert)
//		mockMvc.perform(get("/api/v1/users/1")) // 模拟发送一个 GET 请求
//				.andExpect(status().isOk()) // 验证 HTTP 状态码是否为 200 OK
//				.andExpect((ResultMatcher) jsonPath("$.code").value(200)) // 验证响应体中 JSON 的 code 字段是否为 200
//				.andExpect((ResultMatcher) jsonPath("$.data.username").value("admin")); // 验证响应体中 JSON 的 data.username 字段是否为 "admin"
//	}
//
//	@Test
//	@DisplayName("【接口层】测试获取单个用户 - 失败场景 (无权限)")
//	@WithMockUser // 模拟一个已登录但没有任何权限的普通用户
//	void testGetUserById_Forbidden() throws Exception {
//		// 执行请求
//		mockMvc.perform(get("/api/v1/users/1"))
//				.andExpect(status().isForbidden()); // 验证 HTTP 状态码是否为 403 Forbidden
//	}
//
//	@Test
//	@DisplayName("【接口层】测试创建新用户 - 成功场景")
//	@WithMockUser(authorities = "user:create") // 模拟一个拥有 'user:create' 权限的用户
//	void testCreateUserApi_Success() throws Exception {
//		// 1. 设定模拟行为 (Arrange)
//		// 假设无论传入什么 UserCreateDTO，服务层都会成功创建一个用户并返回一个 UserVO
//		when(mockedUserService.createUser(any(UserCreateDTO.class))).thenAnswer(invocation -> {
//			UserCreateDTO input = invocation.getArgument(0);
//			UserVO output = new UserVO();
//			output.setId(99L);
//			output.setUsername(input.getUsername());
//			output.setRealName(input.getRealName());
//			return output;
//		});
//
//		// 2. 执行并验证 (Act & Assert)
//		mockMvc.perform(post("/api/v1/users") // 模拟发送一个 POST 请求
//						.contentType(MediaType.APPLICATION_JSON) // 设置请求头 Content-Type
//						.content(objectMapper.writeValueAsString(userCreateDTO))) // 设置请求体 (将DTO对象转为JSON字符串)
//				.andExpect(status().isOk()) // 验证状态码
//				.andExpect(jsonPath("$.data.id").value(99L)) // 验证返回的ID
//				.andExpect(jsonPath("$.data.username").value("testuser")); // 验证返回的用户名
//	}
}

