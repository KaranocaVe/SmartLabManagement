INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 1, p.id FROM `permissions` p;


-- 确保用户存在
CREATE USER IF NOT EXISTS 'labUser'@'%' IDENTIFIED BY 'labPass';

-- 授予权限（允许从任意主机连接，尤其是容器外或不同网段的情况）
GRANT ALL PRIVILEGES ON smart_lab_db.* TO 'labUser'@'%';

-- 刷新权限
FLUSH PRIVILEGES;

UPDATE `users` SET `password_hash` = '$2a$10$x5j/lyq1If5riBguJ9xhKeKuGDb5XNSGSstIewgvWrOVB1UCHIDgq';