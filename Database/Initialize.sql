-- ------------------------------------------------------
-- 智能实验室运行及管理平台 - 数据库初始化脚本
-- 设计者: Gemini
-- 版本: 1.0
-- 时间: 2025-07-11
-- ------------------------------------------------------

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `smart_lab_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE `smart_lab_db`;

-- ------------------------------------------------------
-- 模块一：用户与权限管理 (User & Permission)
-- ------------------------------------------------------

-- 1. 用户表 (users)
CREATE TABLE `users` (
                         `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
                         `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名/学号/工号',
                         `password_hash` VARCHAR(255) NOT NULL COMMENT '哈希后的密码',
                         `real_name` VARCHAR(50) NOT NULL COMMENT '真实姓名',
                         `email` VARCHAR(100) NOT NULL UNIQUE COMMENT '电子邮箱',
                         `phone` VARCHAR(20) NULL COMMENT '联系电话',
                         `status` ENUM('active', 'inactive', 'locked') NOT NULL DEFAULT 'active' COMMENT '账户状态',
                         `mfa_secret` VARCHAR(255) NULL COMMENT '多因素认证密钥',
                         `last_login_at` DATETIME NULL COMMENT '最后登录时间',
                         `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                         `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT '用户信息表';

-- 2. 角色表 (roles)
CREATE TABLE `roles` (
                         `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '角色ID',
                         `role_name` VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名称 (e.g., admin, teacher, student)',
                         `description` VARCHAR(255) NULL COMMENT '角色描述',
                         `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                         `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT '角色定义表';

-- 3. 权限表 (permissions)
CREATE TABLE `permissions` (
                               `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '权限ID',
                               `permission_code` VARCHAR(100) NOT NULL UNIQUE COMMENT '权限唯一标识码 (e.g., equipment:create)',
                               `description` VARCHAR(255) NULL COMMENT '权限描述',
                               `module` VARCHAR(50) NOT NULL COMMENT '所属模块 (e.g., user_management, resource_management)',
                               PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT '系统功能权限表';

-- 4. 用户角色关联表 (user_roles)
CREATE TABLE `user_roles` (
                              `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
                              `role_id` INT UNSIGNED NOT NULL COMMENT '角色ID',
                              PRIMARY KEY (`user_id`, `role_id`),
                              FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
                              FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT '用户与角色的关联表';

-- 5. 角色权限关联表 (role_permissions)
CREATE TABLE `role_permissions` (
                                    `role_id` INT UNSIGNED NOT NULL COMMENT '角色ID',
                                    `permission_id` INT UNSIGNED NOT NULL COMMENT '权限ID',
                                    PRIMARY KEY (`role_id`, `permission_id`),
                                    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
                                    FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT '角色与权限的关联表';

-- 6. 用户临时权限表 (user_permissions)
CREATE TABLE `user_permissions` (
                                    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
                                    `permission_id` INT UNSIGNED NOT NULL COMMENT '权限ID',
                                    `expires_at` DATETIME NULL COMMENT '权限过期时间，NULL表示永不过期',
                                    `granted_by_user_id` BIGINT UNSIGNED NULL COMMENT '授权人ID',
                                    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    PRIMARY KEY (`id`),
                                    UNIQUE KEY `uk_user_permission` (`user_id`, `permission_id`),
                                    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
                                    FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE,
                                    FOREIGN KEY (`granted_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB COMMENT '用户特定临时权限表';

-- ------------------------------------------------------
-- 模块二：实验室资源管理 (Lab Resource)
-- ------------------------------------------------------

-- 7. 场地表 (labs)
CREATE TABLE `labs` (
                        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '实验室/场地ID',
                        `name` VARCHAR(100) NOT NULL COMMENT '实验室名称或编号',
                        `location` VARCHAR(255) NULL COMMENT '物理位置',
                        `status` ENUM('available', 'in_use', 'maintenance') NOT NULL DEFAULT 'available' COMMENT '场地状态',
                        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT '实验室场地信息表';

-- 8. 供应商表 (suppliers)
CREATE TABLE `suppliers` (
                             `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                             `name` VARCHAR(255) NOT NULL COMMENT '供应商名称',
                             `contact_person` VARCHAR(100) NULL COMMENT '联系人',
                             `contact_phone` VARCHAR(50) NULL COMMENT '联系电话',
                             `address` TEXT NULL COMMENT '地址',
                             `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                             PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT '供应商信息表';


-- 9. 设备表 (equipment)
CREATE TABLE `equipment` (
                             `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '设备ID',
                             `name` VARCHAR(100) NOT NULL COMMENT '设备名称',
                             `asset_number` VARCHAR(100) UNIQUE NOT NULL COMMENT '资产编号',
                             `model` VARCHAR(100) NULL COMMENT '设备型号',
                             `lab_id` INT UNSIGNED NULL COMMENT '所属实验室ID',
                             `supplier_id` BIGINT UNSIGNED NULL COMMENT '供应商ID',
                             `purchase_date` DATE NULL COMMENT '购置日期',
                             `status` ENUM('available', 'in_use', 'reserved', 'maintenance', 'scrapped') NOT NULL DEFAULT 'available' COMMENT '设备状态',
                             `maintenance_cycle_days` INT NULL COMMENT '维护周期（天）',
                             `next_maintenance_date` DATE NULL COMMENT '下次维护日期',
                             `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                             PRIMARY KEY (`id`),
                             FOREIGN KEY (`lab_id`) REFERENCES `labs`(`id`) ON DELETE SET NULL,
                             FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB COMMENT '设备信息表';


-- 10. 设备维护记录表 (equipment_maintenance_records)
CREATE TABLE `equipment_maintenance_records` (
                                                 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                                 `equipment_id` BIGINT UNSIGNED NOT NULL,
                                                 `maintenance_date` DATE NOT NULL COMMENT '维护日期',
                                                 `type` ENUM('scheduled', 'repair') NOT NULL COMMENT '维护类型',
                                                 `description` TEXT NOT NULL COMMENT '维护内容描述',
                                                 `technician` VARCHAR(100) NULL COMMENT '维护人员',
                                                 `cost` DECIMAL(10, 2) NULL COMMENT '费用',
                                                 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                 PRIMARY KEY (`id`),
                                                 FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT '设备维护历史记录表';


-- 11. 物资表 (materials)
CREATE TABLE `materials` (
                             `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '物资ID',
                             `name` VARCHAR(100) NOT NULL COMMENT '物资名称',
                             `specification` VARCHAR(100) NULL COMMENT '规格型号',
                             `unit` VARCHAR(20) NOT NULL COMMENT '单位 (如: mL, g, 个)',
                             `current_stock` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '当前库存',
                             `low_stock_threshold` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '低库存预警阈值',
                             `storage_location` VARCHAR(255) NULL COMMENT '存放位置',
                             `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                             PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT '实验物资耗材库存表';


-- 12. 物资库存变更记录表 (material_stock_movements)
CREATE TABLE `material_stock_movements` (
                                            `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                            `material_id` BIGINT UNSIGNED NOT NULL,
                                            `movement_type` ENUM('inbound', 'outbound_request', 'adjustment') NOT NULL COMMENT '变更类型',
                                            `quantity_change` DECIMAL(10, 2) NOT NULL COMMENT '变更数量(正增负减)',
                                            `user_id` BIGINT UNSIGNED NULL COMMENT '操作人',
                                            `source_document_id` BIGINT UNSIGNED NULL COMMENT '关联单据ID(如申领单ID)',
                                            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                            PRIMARY KEY (`id`),
                                            FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON DELETE CASCADE,
                                            FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB COMMENT '物资库存流水表';


-- 13. 资源预约与申请表 (resource_requests)
CREATE TABLE `resource_requests` (
                                     `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '申请ID',
                                     `user_id` BIGINT UNSIGNED NOT NULL COMMENT '申请人ID',
                                     `request_type` ENUM('equipment', 'lab', 'material') NOT NULL COMMENT '请求类型',
                                     `resource_id` BIGINT UNSIGNED NOT NULL COMMENT '资源ID',
                                     `quantity` DECIMAL(10, 2) NULL COMMENT '申请数量(用于物资)',
                                     `start_time` DATETIME NULL COMMENT '预定开始时间',
                                     `end_time` DATETIME NULL COMMENT '预定结束时间',
                                     `purpose` TEXT NULL COMMENT '申请事由',
                                     `status` ENUM('pending_approval', 'approved', 'rejected', 'completed', 'cancelled') NOT NULL DEFAULT 'pending_approval',
                                     `approver_id` BIGINT UNSIGNED NULL COMMENT '审批人ID',
                                     `approval_notes` TEXT NULL COMMENT '审批意见',
                                     `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                     `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     PRIMARY KEY (`id`),
                                     FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
                                     FOREIGN KEY (`approver_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB COMMENT '统一资源申请表';

-- ------------------------------------------------------
-- 模块三：实验项目管理 (Experiment Project)
-- ------------------------------------------------------

-- 14. 项目表 (projects)
CREATE TABLE `projects` (
                            `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '项目ID',
                            `name` VARCHAR(255) NOT NULL COMMENT '项目名称',
                            `description` TEXT NULL COMMENT '项目描述',
                            `project_lead_id` BIGINT UNSIGNED NOT NULL COMMENT '项目负责人ID',
                            `status` ENUM('proposal', 'ongoing', 'completed', 'archived', 'paused') NOT NULL DEFAULT 'proposal',
                            `start_date` DATE NULL COMMENT '计划开始日期',
                            `end_date` DATE NULL COMMENT '计划结束日期',
                            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            PRIMARY KEY (`id`),
                            FOREIGN KEY (`project_lead_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT '实验项目信息表';

-- 15. 项目成员表 (project_members)
CREATE TABLE `project_members` (
                                   `project_id` BIGINT UNSIGNED NOT NULL COMMENT '项目ID',
                                   `user_id` BIGINT UNSIGNED NOT NULL COMMENT '成员用户ID',
                                   `role_in_project` VARCHAR(50) NOT NULL COMMENT '在项目中的角色',
                                   PRIMARY KEY (`project_id`, `user_id`),
                                   FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
                                   FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT '项目与成员的关联表';

-- 16. 项目任务表 (project_tasks)
CREATE TABLE `project_tasks` (
                                 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '任务ID',
                                 `project_id` BIGINT UNSIGNED NOT NULL COMMENT '所属项目ID',
                                 `name` VARCHAR(255) NOT NULL COMMENT '任务名称',
                                 `description` TEXT NULL,
                                 `assigned_to_user_id` BIGINT UNSIGNED NULL COMMENT '负责人ID',
                                 `status` ENUM('todo', 'in_progress', 'done', 'blocked') NOT NULL DEFAULT 'todo',
                                 `due_date` DATE NULL COMMENT '截止日期',
                                 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                 PRIMARY KEY (`id`),
                                 FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
                                 FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB COMMENT '实验项目任务分解表';


-- 17. 附件表 (attachments)
CREATE TABLE `attachments` (
                               `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                               `file_name` VARCHAR(255) NOT NULL,
                               `file_path` VARCHAR(512) NOT NULL,
                               `file_type` VARCHAR(100) NULL,
                               `file_size` INT UNSIGNED NULL COMMENT '文档大小(Bytes)',
                               `uploader_id` BIGINT UNSIGNED NOT NULL,
                               `parent_type` VARCHAR(50) NOT NULL COMMENT '关联对象类型 (e.g., project, record)',
                               `parent_id` BIGINT UNSIGNED NOT NULL COMMENT '关联对象ID',
                               `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               PRIMARY KEY (`id`),
                               INDEX `idx_parent` (`parent_type`, `parent_id`),
                               FOREIGN KEY (`uploader_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION
) ENGINE=InnoDB COMMENT '统一附件管理表';


-- 18. 实验记录表 (experiment_records)
CREATE TABLE `experiment_records` (
                                      `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
                                      `project_id` BIGINT UNSIGNED NOT NULL COMMENT '所属项目ID',
                                      `task_id` BIGINT UNSIGNED NULL COMMENT '关联任务ID',
                                      `user_id` BIGINT UNSIGNED NOT NULL COMMENT '记录人ID',
                                      `content` LONGTEXT NULL COMMENT '实验过程、原始数据等内容',
                                      `structured_data` JSON NULL COMMENT '结构化数据',
                                      `record_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                      PRIMARY KEY (`id`),
                                      FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
                                      FOREIGN KEY (`task_id`) REFERENCES `project_tasks`(`id`) ON DELETE SET NULL,
                                      FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT '实验过程记录表';


-- 19. 报告版本表 (report_versions)
CREATE TABLE `report_versions` (
                                   `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                   `report_id` BIGINT UNSIGNED NOT NULL COMMENT '所属报告ID',
                                   `version_number` VARCHAR(20) NOT NULL,
                                   `content` LONGTEXT NULL,
                                   `modifier_id` BIGINT UNSIGNED NOT NULL,
                                   `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   PRIMARY KEY (`id`),
                                   FOREIGN KEY (`modifier_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT
    -- report_id 的外键在 experiment_reports 表创建后添加
) ENGINE=InnoDB COMMENT '报告版本历史表';


-- 20. 实验报告表 (experiment_reports)
CREATE TABLE `experiment_reports` (
                                      `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '报告ID',
                                      `project_id` BIGINT UNSIGNED NOT NULL COMMENT '所属项目ID',
                                      `title` VARCHAR(255) NOT NULL COMMENT '报告标题',
                                      `author_id` BIGINT UNSIGNED NOT NULL COMMENT '作者ID',
                                      `current_version_id` BIGINT UNSIGNED NULL COMMENT '当前版本ID',
                                      `status` ENUM('draft', 'submitted', 'archived') NOT NULL DEFAULT 'draft',
                                      `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                      PRIMARY KEY (`id`),
                                      FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
                                      FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
                                      FOREIGN KEY (`current_version_id`) REFERENCES `report_versions`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB COMMENT '实验报告与成果归档表';

-- 为 report_versions 表添加缺失的外键
ALTER TABLE `report_versions` ADD CONSTRAINT `fk_report_id` FOREIGN KEY (`report_id`) REFERENCES `experiment_reports`(`id`) ON DELETE CASCADE;


-- ------------------------------------------------------
-- 模块四：安全与合规 (Safety & Compliance)
-- ------------------------------------------------------

-- 21. 风险评估表 (risk_assessments)
CREATE TABLE `risk_assessments` (
                                    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                    `project_id` BIGINT UNSIGNED NOT NULL,
                                    `assessed_by_user_id` BIGINT UNSIGNED NOT NULL,
                                    `risk_level` ENUM('low', 'medium', 'high', 'critical') NOT NULL,
                                    `identified_risks` TEXT NOT NULL,
                                    `protective_measures` TEXT NOT NULL,
                                    `assessment_date` DATE NOT NULL,
                                    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    PRIMARY KEY (`id`),
                                    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
                                    FOREIGN KEY (`assessed_by_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT '实验项目风险评估表';


-- 22. 安全事故记录表 (safety_incidents)
CREATE TABLE `safety_incidents` (
                                    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                    `lab_id` INT UNSIGNED NULL,
                                    `reported_by_user_id` BIGINT UNSIGNED NOT NULL,
                                    `incident_time` DATETIME NOT NULL,
                                    `description` TEXT NOT NULL,
                                    `actions_taken` TEXT NULL,
                                    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    PRIMARY KEY (`id`),
                                    FOREIGN KEY (`lab_id`) REFERENCES `labs`(`id`) ON DELETE SET NULL,
                                    FOREIGN KEY (`reported_by_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT '安全事故记录与分析表';


-- ------------------------------------------------------
-- 模块五：日志与审计 (Log & Audit)
-- ------------------------------------------------------

-- 23. 操作日志表 (audit_logs)
CREATE TABLE `audit_logs` (
                              `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                              `user_id` BIGINT UNSIGNED NULL,
                              `action` VARCHAR(100) NOT NULL,
                              `target_type` VARCHAR(50) NULL,
                              `target_id` BIGINT UNSIGNED NULL,
                              `details` JSON NULL,
                              `ip_address` VARCHAR(45) NULL,
                              `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              PRIMARY KEY (`id`),
                              INDEX `idx_user_action` (`user_id`, `action`),
                              INDEX `idx_target` (`target_type`, `target_id`)
) ENGINE=InnoDB COMMENT '用户操作审计日志表';

-- 24. 系统日志表 (system_logs)
CREATE TABLE `system_logs` (
                               `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                               `level` ENUM('INFO', 'DEBUG', 'WARN', 'ERROR', 'FATAL') NOT NULL,
                               `source` VARCHAR(100) NULL,
                               `message` TEXT NOT NULL,
                               `stack_trace` TEXT NULL,
                               `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               PRIMARY KEY (`id`),
                               INDEX `idx_level_time` (`level`, `created_at`)
) ENGINE=InnoDB COMMENT '系统运行日志表';


-- ------------------------------------------------------
-- 初始化基础数据
-- ------------------------------------------------------

-- 插入角色
INSERT INTO `roles` (`id`, `role_name`, `description`) VALUES
                                                           (1, '超级管理员', '拥有系统所有权限'),
                                                           (2, '实验室负责人', '管理实验室资源和审批'),
                                                           (3, '教师', '管理项目和指导学生'),
                                                           (4, '学生', '参与项目和使用设备'),
                                                           (5, '访客', '仅有部分查看权限');

-- 插入权限 (示例)
INSERT INTO `permissions` (`permission_code`, `description`, `module`) VALUES
-- 用户与权限
('user:create', '创建用户', '用户管理'),
('user:edit', '编辑用户', '用户管理'),
('user:delete', '删除用户', '用户管理'),
('user:view', '查看用户列表', '用户管理'),
('role:assign', '分配角色', '权限管理'),
-- 项目管理
('project:create', '创建项目', '项目管理'),
('project:edit', '编辑项目信息', '项目管理'),
('project:delete', '删除项目', '项目管理'),
('project:view:all', '查看所有项目', '项目管理'),
('project:assign:member', '分配项目成员', '项目管理'),
-- 资源管理
('resource:request', '申请/预约资源', '资源管理'),
('resource:approve', '审批资源申请', '资源管理'),
('equipment:manage', '管理设备信息', '资源管理'),
('material:manage', '管理物资信息', '资源管理'),
-- 安全管理
('safety:assess', '进行风险评估', '安全管理'),
('safety:log_incident', '记录安全事故', '安全管理');

-- 为超级管理员分配所有权限 (实际应用中，可通过后端逻辑实现，此处为演示)
-- INSERT INTO `role_permissions` (`role_id`, `permission_id`) SELECT 1, id FROM `permissions`;

-- 为教师分配部分权限
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
                                                                (3, (SELECT id FROM permissions WHERE permission_code = 'project:create')),
                                                                (3, (SELECT id FROM permissions WHERE permission_code = 'project:edit')),
                                                                (3, (SELECT id FROM permissions WHERE permission_code = 'resource:request'));

-- 为学生分配基本权限
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
    (4, (SELECT id FROM permissions WHERE permission_code = 'resource:request'));


-- ------------------------------------------------------
-- 脚本结束
-- ------------------------------------------------------