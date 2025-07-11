# 《智能实验室运行及管理平台》数据库设计文档

-   **项目名称**: 智能实验室运行及管理平台
-   **版本**: 1.0
-   **设计日期**: 2025-07-11
-   **设计者**: zsj

## 1. 设计概述与理念

本文档定义了“智能实验室运行及管理平台”的完整数据库结构。设计遵循以下核心原则，以指导后续的开发工作：

1.  **模块化 (Modularity)**：数据库表根据业务功能（用户权限、资源、项目、安全、日志）进行逻辑分组，便于理解和维护。
2.  **规范化 (Normalization)**：遵循第三范式（3NF），减少数据冗余，保证数据一致性。例如，将供应商、维护记录等信息独立成表。
3.  **可审计性 (Auditability)**：所有关键操作均有日志记录。库存、权限等变更均有流水表进行追踪，确保所有变动都有据可查。
4.  **可扩展性 (Scalability)**：采用通用设计（如统一的附件表、资源申请表），便于未来在不大规模修改表结构的情况下，平滑地增加新功能。
5.  **关系明确 (Clarity)**：通过外键约束和清晰的命名规范，明确表与表之间的关系。

## 2. 核心实体关系 (Conceptual ERD)

以下是系统核心实体之间的主要关系，用于快速理解数据流：

* `[用户 (User)]` `(1) -- (*) ` `[角色 (Role)]` (通过 `user_roles` 关联)
* `[角色 (Role)]` `(1) -- (*)` `[权限 (Permission)]` (通过 `role_permissions` 关联)
* `[项目 (Project)]` `(1) -- (*)` `[用户 (User)]` (通过 `project_members` 关联)
* `[项目 (Project)]` `(1) -- (*)` `[任务 (Task)]`, `[实验记录 (ExperimentRecord)]`, `[实验报告 (ExperimentReport)]`
* `[设备 (Equipment)]` `(1) -- (*)` `[设备维护记录 (EquipmentMaintenanceRecord)]`
* `[物资 (Material)]` `(1) -- (*)` `[物资库存变更记录 (MaterialStockMovement)]`
* `[用户 (User)]` `(1) -- (*)` `[资源预约/申请 (ResourceRequest)]`
* `[附件 (Attachment)]` `(*) -- (1)` `[项目/记录/报告等]` (多态关联)
* `[审计日志 (AuditLog)]` `(*) -- (1)` `[用户 (User)]`

## 3. 表结构详细定义

### 模块一：用户与权限管理 (User & Permission)

#### 3.1. `users` - 用户表
**描述**：存储所有系统用户的核心信息，是所有操作的主体。
| 列名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | 唯一标识符，主键 |
| `username` | `VARCHAR(50)` | `NOT NULL`, `UNIQUE` | 用户的登录名，如学号/工号，必须唯一 |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | 使用 bcrypt 或 Argon2 哈希后的密码，绝不能明文存储 |
| `real_name` | `VARCHAR(50)` | `NOT NULL` | 用户的真实姓名 |
| `email` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | 电子邮箱，用于通知和密码重置，必须唯一 |
| `phone` | `VARCHAR(20)` | `NULL` | 手机号码 |
| `status` | `ENUM('active', 'inactive', 'locked')` | `NOT NULL`, `DEFAULT 'active'` | 账户状态：`active`-活跃, `inactive`-未激活/禁用, `locked`-锁定 |
| `mfa_secret` | `VARCHAR(255)` | `NULL` | 用于 TOTP 的多因素认证密钥 |
| `last_login_at` | `DATETIME` | `NULL` | 用户最后一次成功登录的时间 |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | 记录创建时间 |
| `updated_at` | `TIMESTAMP` | `ON UPDATE CURRENT_TIMESTAMP` | 记录最后更新时间 |

#### 3.2. `roles` - 角色表
**描述**：定义用户的一组权限集合，如管理员、教师等。
| 列名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | 角色唯一ID |
| `role_name` | `VARCHAR(50)` | `NOT NULL`, `UNIQUE` | 角色名称，必须唯一 |
| `description` | `VARCHAR(255)` | `NULL` | 对角色的功能进行简要描述 |

#### 3.3. `permissions` - 权限表
**描述**：定义系统中最小粒度的操作权限，是权限控制的原子。
| 列名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `INT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | 权限唯一ID |
| `permission_code` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | 权限代码，采用 `模块:操作` 格式，如 `project:create` |
| `description` | `VARCHAR(255)` | `NULL` | 对权限作用的详细描述 |
| `module` | `VARCHAR(50)` | `NOT NULL` | 该权限所属的功能模块，用于分组管理 |

#### 3.4. 关联表
* **`user_roles`**: 链接 `users` 和 `roles` 的多对多关系。
    * `user_id`: 外键，关联 `users.id`
    * `role_id`: 外键，关联 `roles.id`
* **`role_permissions`**: 链接 `roles` 和 `permissions` 的多对多关系。
    * `role_id`: 外键，关联 `roles.id`
    * `permission_id`: 外键，关联 `permissions.id`
* **`user_permissions`**: 授予用户独立的临时或特殊权限。
    * `user_id`: 外键，关联 `users.id`
    * `permission_id`: 外键，关联 `permissions.id`
    * `expires_at`: `DATETIME`，权限的过期时间，`NULL` 表示永不过期
    * `granted_by_user_id`: `BIGINT UNSIGNED`，外键，关联 `users.id`，记录授权人

### 模块二：实验室资源管理 (Lab Resource)

#### 3.5. `equipment` - 设备表
**描述**：管理实验室的所有仪器设备。
| 列名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT` | 设备唯一ID |
| `name` | `VARCHAR(100)` | `NOT NULL` | 设备名称 |
| `asset_number` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | 资产编号，唯一标识一台物理设备 |
| `status` | `ENUM('available', 'in_use', 'reserved', 'maintenance', 'scrapped')` | `NOT NULL` | 设备当前状态 |
| `lab_id` | `INT UNSIGNED` | `FOREIGN KEY` | 所在场地ID，关联 `labs.id` |
| ... | ... | ... | (其他字段如型号、供应商、维护周期等) |

#### 3.6. `materials` - 物资表
**描述**：管理实验耗材和试剂的库存。
| 列名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT`| 物资唯一ID |
| `name` | `VARCHAR(100)` | `NOT NULL` | 物资名称 |
| `current_stock` | `DECIMAL(10, 2)` | `NOT NULL` | 当前库存数量 |
| `low_stock_threshold`| `DECIMAL(10, 2)` | `NOT NULL` | 低于此值时触发预警 |
| ... | ... | ... | (其他字段如规格、单位、存放位置等) |

#### 3.7. `material_stock_movements` - 物资库存变更记录表
**描述**：作为物资库存的不可变账本，记录每一次库存变动，用于审计。
| 列名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT`| 记录ID |
| `material_id` | `BIGINT UNSIGNED` | `FOREIGN KEY` | 关联的物资ID |
| `movement_type` | `ENUM('inbound', 'outbound_request', 'adjustment')` | `NOT NULL` | 变更类型：入库、申领出库、盘点调整 |
| `quantity_change`| `DECIMAL(10, 2)` | `NOT NULL` | 变更数量，正数表示增加，负数表示减少 |
| `user_id` | `BIGINT UNSIGNED` | `FOREIGN KEY` | 操作人ID |
| `source_document_id`| `BIGINT UNSIGNED`| `NULL` | 关联的单据ID，如申领单ID |

*(为简洁起见，其他资源管理相关表如 `labs`, `suppliers`, `equipment_maintenance_records`, `resource_requests` 的详细字段省略，其结构遵循已提供的SQL脚本)*

### 模块三：实验项目管理 (Experiment Project)

#### 3.8. `projects` - 项目表
**描述**：定义一个完整的科研实验项目，是业务活动的核心。
| 列名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT`| 项目唯一ID |
| `name` | `VARCHAR(255)` | `NOT NULL` | 项目名称 |
| `project_lead_id`| `BIGINT UNSIGNED` | `FOREIGN KEY` | 项目负责人ID，关联 `users.id` |
| `status` | `ENUM('proposal', 'ongoing', 'completed', 'archived', 'paused')`| `NOT NULL` | 项目的生命周期状态 |
| ... | ... | ... | (其他字段如描述、起止日期等) |

#### 3.9. `experiment_records` - 实验记录表
**描述**：记录实验过程中的数据、现象和笔记。
| 列名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT`| 记录ID |
| `project_id`| `BIGINT UNSIGNED` | `FOREIGN KEY` | 所属项目ID |
| `user_id` | `BIGINT UNSIGNED` | `FOREIGN KEY` | 记录人ID |
| `content` | `LONGTEXT` | `NULL` | 富文本格式的实验内容 |
| `structured_data`| `JSON` | `NULL` | 结构化数据，用于后续分析 |
| `record_time` | `DATETIME` | `NOT NULL` | 实验记录的发生时间 |

#### 3.10. `attachments` - 附件表
**描述**：统一管理所有上传的文件，采用多态关联设计。
| 列名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | `PRIMARY KEY`, `AUTO_INCREMENT`| 附件ID |
| `file_name` | `VARCHAR(255)` | `NOT NULL` | 文件的原始名称 |
| `file_path` | `VARCHAR(512)` | `NOT NULL` | 文件在服务器上的存储路径 |
| `uploader_id`| `BIGINT UNSIGNED` | `FOREIGN KEY` | 上传者ID |
| `parent_type`| `VARCHAR(50)` | `NOT NULL`, `INDEX` | 关联父对象的类型，如 `'project'`, `'record'` |
| `parent_id` | `BIGINT UNSIGNED` | `NOT NULL`, `INDEX` | 关联父对象的ID |

*(其他项目管理相关表如 `project_members`, `project_tasks`, `experiment_reports`, `report_versions` 等省略)*

### 模块四与五：安全、日志与审计
*(`risk_assessments`, `safety_incidents`, `audit_logs`, `system_logs` 等表省略，其结构遵循已提供的SQL脚本)*

## 4. 核心业务逻辑说明

### 4.1. 权限校验逻辑
权限系统是实现业务访问控制的核心。
1.  **定义**: 以 `模块:操作` 格式在 `permissions` 表中定义权限码。
2.  **授予**: 通过 `role_permissions` 和 `user_permissions` 表将权限码赋予角色或用户。
3.  **校验**:
    * 用户登录后，后端聚合其所有权限码并缓存。
    * 后端 API 接口声明自身所需的权限码。
    * 收到请求时，比对用户拥有的权限码与接口所需的权限码。
    * 前端根据用户的权限码集合，动态渲染或禁用UI元素（如按钮、菜单）。

### 4.2. 多态关联（Polymorphic Relationships）
`attachments` 表使用 `parent_type` 和 `parent_id` 两个字段来关联到其他任何表。
* **示例**: 一个附件若属于某个实验记录，则其 `parent_type = 'experiment_record'`，`parent_id` 为该实验记录的 ID。
* **优势**: 无需为每个可能需要附件的表都创建一个独立的附件关联表，扩展性极强。`audit_logs` 表的 `target_type` 和 `target_id` 也是同理。

### 4.3. 库存管理逻辑
物资库存 (`materials.current_stock`) 的更新**必须**通过 `material_stock_movements` 表来驱动。
* **流程**: 当发生入库、出库或盘点时，程序应向 `material_stock_movements` 表插入一条记录，然后通过触发器或应用层逻辑来更新 `materials` 表中的主库存字段。
* **目的**: 保证库存的每一次变动都有迹可循，提供了完整的物料追溯链。

## 5. 初始数据 (Data Seeding)
系统首次部署时，必须在以下两个表中填充基础数据，以保证系统可正常运行：
1.  **`roles`**: 必须包含 "超级管理员", "实验室负责人", "教师", "学生", "访客" 等基础角色。
2.  **`permissions`**: 必须包含所有基础功能的权限码，如 `user:create`, `project:create` 等。
3.  **`role_permissions`**: 至少需要为“超级管理员”角色关联所有权限，为其他基础角色分配其默认权限。

## 6. 附录：数据库命名规范
-   **表名**: 使用小写字母和下划线 (`snake_case`)，采用复数形式，如 `users`, `projects`。
-   **列名**: 使用小写字母和下划线 (`snake_case`)。
-   **主键**: 统一使用 `id` 作为主键列名。
-   **外键**: 采用 `关联表单数名_id` 的格式，如 `user_id`, `project_id`。