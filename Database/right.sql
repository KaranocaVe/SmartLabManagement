-- ------------------------------------------------------
-- 权限系统终极修复与默认角色授权脚本
-- ------------------------------------------------------

-- 步骤 1: 检查并插入缺失的核心权限码
-- 我们将使用 INSERT IGNORE 来插入，如果权限码已存在，则会忽略，不会报错。
-- 这是保证权限系统完整性的关键一步。

INSERT IGNORE INTO `permissions` (`permission_code`, `description`, `module`) VALUES
                                                                                  ('role:manage', '管理角色与权限分配', '权限管理'),
                                                                                  ('equipment:manage', '管理设备信息', '资源管理'),
                                                                                  ('lab:manage', '管理场地信息', '资源管理'),
                                                                                  ('supplier:manage', '管理供应商信息', '资源管理');


-- 步骤 2: 为超级管理员 (role_id = 1) 重新授权所有权限
-- 前提：请确保您的 'roles' 表中，“超级管理员”的角色ID为 1。

-- (安全起见) 先删除超级管理员可能存在的旧的、不完整的权限关联。
DELETE FROM `role_permissions` WHERE `role_id` = 1;

-- 将 `permissions` 表中的所有权限，都授予 `role_id` 为 1 的“超级管理员”角色。
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 1, p.id FROM `permissions` p;


-- ------------------------------------------------------
-- 新增：为其他核心角色分配默认权限
-- ------------------------------------------------------

-- 步骤 3: 为实验室负责人 (role_id = 2) 分配权限
-- 职责：管理实验室的日常运作，包括资源审批、安全管理等。
-- 前提：请确保“实验室负责人”的角色ID为 2。

DELETE FROM `role_permissions` WHERE `role_id` = 2;
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 2, p.id FROM `permissions` p
WHERE p.permission_code IN (
                            'user:view', 'role:assign',             -- 查看用户、分配角色
                            'project:view:all',                     -- 查看所有项目
                            'resource:approve',                     -- 审批资源申请
                            'equipment:manage', 'material:manage',  -- 管理设备和物资
                            'lab:manage', 'supplier:manage',        -- 管理场地和供应商
                            'safety:assess', 'safety:log_incident'  -- 安全管理
    );


-- 步骤 4: 为教师 (role_id = 3) 分配权限
-- 职责：开展科研项目，管理自己的项目和学生。
-- 前提：请确保“教师”的角色ID为 3。

DELETE FROM `role_permissions` WHERE `role_id` = 3;
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 3, p.id FROM `permissions` p
WHERE p.permission_code IN (
                            'user:view',                            -- 查看用户列表（以添加项目成员）
                            'project:create', 'project:edit',       -- 创建和编辑项目
                            'project:assign:member',                -- 分配项目成员
                            'resource:request'                      -- 申请资源
    );


-- 步骤 5: 为学生 (role_id = 4) 分配权限
-- 职责：参与项目，申请使用资源。
-- 前提：请确保“学生”的角色ID为 4。

DELETE FROM `role_permissions` WHERE `role_id` = 4;
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 4, p.id FROM `permissions` p
WHERE p.permission_code IN (
    'resource:request'                      -- 申请资源
    );


-- ------------------------------------------------------
-- 修复与授权完成
-- ------------------------------------------------------
