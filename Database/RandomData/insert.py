import mysql.connector
import bcrypt
from faker import Faker
import random
from datetime import datetime, timedelta

# --- 配置区 ---
# 请根据您的数据库信息修改以下配置
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password',  # <-- 修改为您的密码
    'database': 'smart_lab_db'
}

# 要生成的随机数据量
NUM_USERS = 50
NUM_SUPPLIERS = 10
NUM_LABS = 5
NUM_EQUIPMENT_PER_LAB = 8
NUM_MATERIALS = 30
NUM_PROJECTS = 20
NUM_TASKS_PER_PROJECT = 5
NUM_RECORDS_PER_PROJECT = 10
NUM_REQUESTS = 100
NUM_INCIDENTS = 5
# --- 配置区结束 ---


# 初始化 Faker
fake = Faker('zh_CN')


def get_db_connection():
    """创建数据库连接"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        print("✅ 数据库连接成功！")
        return conn
    except mysql.connector.Error as err:
        print(f"❌ 数据库连接失败: {err}")
        return None


def populate_data():
    """填充所有数据的主函数"""
    conn = get_db_connection()
    if not conn:
        return

    cursor = conn.cursor()

    try:
        # 清理旧数据（可选，为保证脚本可重复执行）
        print("\n🧹 正在清理旧的测试数据...")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
        tables_to_truncate = [
            'safety_incidents', 'risk_assessments', 'experiment_records', 'attachments',
            'report_versions', 'experiment_reports', 'project_tasks', 'project_members',
            'projects', 'resource_requests', 'material_stock_movements',
            'equipment_maintenance_records', 'equipment', 'materials', 'suppliers',
            'labs', 'user_permissions', 'user_roles', 'users'
        ]
        for table in tables_to_truncate:
            cursor.execute(f"TRUNCATE TABLE {table};")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
        print("✅ 旧数据清理完毕。")

        # --- 数据生成开始 ---
        print("\n🚀 开始生成新的测试数据...")

        # 1. 获取预设ID
        cursor.execute("SELECT id FROM roles")
        role_ids = [item[0] for item in cursor.fetchall()]

        # 2. 生成内核实体
        user_ids = generate_users(cursor, NUM_USERS, role_ids)
        supplier_ids = generate_suppliers(cursor, NUM_SUPPLIERS)
        lab_ids = generate_labs(cursor, NUM_LABS)
        material_ids = generate_materials(cursor, NUM_MATERIALS)
        equipment_ids = generate_equipment(cursor, lab_ids, supplier_ids, NUM_EQUIPMENT_PER_LAB)

        # 3. 生成项目及关联数据
        project_ids = generate_projects_and_members(cursor, user_ids, NUM_PROJECTS)
        generate_tasks_and_records(cursor, project_ids, user_ids, NUM_TASKS_PER_PROJECT, NUM_RECORDS_PER_PROJECT)

        # 4. 生成业务活动数据
        generate_requests(cursor, user_ids, equipment_ids, lab_ids, material_ids, NUM_REQUESTS)
        generate_incidents(cursor, user_ids, lab_ids, NUM_INCIDENTS)

        # 提交事务
        conn.commit()
        print("\n🎉 所有测试数据已成功生成并提交！")

    except mysql.connector.Error as err:
        print(f"\n❌ 数据生成过程中发生错误: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()
        print("🔌 数据库连接已关闭。")


def generate_users(cursor, count, role_ids):
    print(f"  ↳ 正在生成 {count} 个用户...")
    users = []
    hashed_password = bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt())
    for _ in range(count):
        profile = fake.profile()
        user_data = (
            profile['username'],
            hashed_password,
            profile['name'],
            fake.unique.email(),
            fake.phone_number(),
            random.choice(['active', 'inactive'])
        )
        users.append(user_data)

    sql = "INSERT INTO users (username, password_hash, real_name, email, phone, status) VALUES (%s, %s, %s, %s, %s, %s)"
    cursor.executemany(sql, users)

    # 获取所有新生成的用户ID
    cursor.execute("SELECT id FROM users ORDER BY id DESC LIMIT %s", (count,))
    user_ids = [item[0] for item in cursor.fetchall()]
    user_ids.reverse()

    # 为用户随机分配角色
    user_roles_data = []
    student_role_id = 4  # 假设学生角色ID为4
    for user_id in user_ids:
        # 大部分设为学生，少量设为其他角色
        role_id = random.choices(role_ids, weights=[5, 10, 20, 60, 5], k=1)[0]
        user_roles_data.append((user_id, role_id))

    sql_roles = "INSERT INTO user_roles (user_id, role_id) VALUES (%s, %s)"
    cursor.executemany(sql_roles, user_roles_data)

    return user_ids


def generate_suppliers(cursor, count):
    print(f"  ↳ 正在生成 {count} 个供应商...")
    suppliers = [(fake.company(), fake.name(), fake.phone_number(), fake.address()) for _ in range(count)]
    sql = "INSERT INTO suppliers (name, contact_person, contact_phone, address) VALUES (%s, %s, %s, %s)"
    cursor.executemany(sql, suppliers)
    cursor.execute("SELECT id FROM suppliers ORDER BY id DESC LIMIT %s", (count,))
    supplier_ids = [item[0] for item in cursor.fetchall()]
    supplier_ids.reverse()
    return supplier_ids


def generate_labs(cursor, count):
    print(f"  ↳ 正在生成 {count} 个实验室...")
    labs = [(f"{fake.random_element(elements=('物理', '化学', '生物', '计算机'))}实验室 {i + 1}0{j + 1}",
             f"教学楼 {i + 1} 座 {j + 1} 层") for i in range(2) for j in range(3)][:count]
    sql = "INSERT INTO labs (name, location) VALUES (%s, %s)"
    cursor.executemany(sql, labs)
    cursor.execute("SELECT id FROM labs ORDER BY id DESC LIMIT %s", (count,))
    lab_ids = [item[0] for item in cursor.fetchall()]
    lab_ids.reverse()
    return lab_ids


def generate_materials(cursor, count):
    print(f"  ↳ 正在生成 {count} 种物资...")
    materials_data = []
    for _ in range(count):
        stock = random.uniform(10, 200)
        materials_data.append((
            f"{fake.color_name()}试剂-{random.randint(100, 999)}",
            f"{random.randint(10, 100)}ml/瓶",
            random.choice(['瓶', '盒', 'g', 'L']),
            stock,
            stock * 0.2,  # 预警阈值为库存的20%
            f"储藏柜-{random.choice(['A', 'B', 'C'])}-{random.randint(1, 5)}"
        ))
    sql = "INSERT INTO materials (name, specification, unit, current_stock, low_stock_threshold, storage_location) VALUES (%s, %s, %s, %s, %s, %s)"
    cursor.executemany(sql, materials_data)
    cursor.execute("SELECT id FROM materials ORDER BY id DESC LIMIT %s", (count,))
    material_ids = [item[0] for item in cursor.fetchall()]
    material_ids.reverse()
    return material_ids


def generate_equipment(cursor, lab_ids, supplier_ids, count_per_lab):
    print(f"  ↳ 正在生成 {len(lab_ids) * count_per_lab} 台设备...")
    equipment_data = []
    for lab_id in lab_ids:
        for i in range(count_per_lab):
            equipment_data.append((
                f"{random.choice(['光谱仪', '离心机', '显微镜', '示波器'])}-{lab_id}{i}",
                f"ASSET-{random.randint(10000, 99999)}-{lab_id}{i}",
                random.choice(['TX-2000', 'Super-C', 'Model-S']),
                lab_id,
                random.choice(supplier_ids),
                fake.date_between(start_date='-5y', end_date='-1y'),
                random.choice(['available', 'maintenance', 'in_use']),
                random.choice([90, 180, 365])
            ))
    sql = "INSERT INTO equipment (name, asset_number, model, lab_id, supplier_id, purchase_date, status, maintenance_cycle_days) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.executemany(sql, equipment_data)
    cursor.execute("SELECT id FROM equipment ORDER BY id DESC LIMIT %s", (len(lab_ids) * count_per_lab,))
    equipment_ids = [item[0] for item in cursor.fetchall()]
    equipment_ids.reverse()
    return equipment_ids


def generate_projects_and_members(cursor, user_ids, count):
    print(f"  ↳ 正在生成 {count} 个项目及其成员...")
    projects_data = []
    for _ in range(count):
        start_date = fake.date_between(start_date='-1y', end_date='today')
        projects_data.append((
            f"{fake.bs()}对{fake.job()}影响的研究",
            fake.text(max_nb_chars=200),
            random.choice(user_ids),  # 项目负责人
            random.choice(['proposal', 'ongoing', 'completed']),
            start_date,
            start_date + timedelta(days=random.randint(60, 365))
        ))
    sql = "INSERT INTO projects (name, description, project_lead_id, status, start_date, end_date) VALUES (%s, %s, %s, %s, %s, %s)"
    cursor.executemany(sql, projects_data)
    cursor.execute("SELECT id FROM projects ORDER BY id DESC LIMIT %s", (count,))
    project_ids = [item[0] for item in cursor.fetchall()]
    project_ids.reverse()

    # 分配项目成员
    members_data = []
    for project_id in project_ids:
        member_count = random.randint(2, 5)
        members = random.sample(user_ids, member_count)
        for member_id in members:
            members_data.append((
                project_id, member_id, random.choice(['研究员', '实验员', '数据分析师'])
            ))
    sql_members = "INSERT INTO project_members (project_id, user_id, role_in_project) VALUES (%s, %s, %s)"
    cursor.executemany(sql_members, members_data)

    return project_ids


def generate_tasks_and_records(cursor, project_ids, user_ids, tasks_per_project, records_per_project):
    print(f"  ↳ 正在生成项目任务和实验记录...")
    tasks_data = []
    records_data = []
    for project_id in project_ids:
        # 生成任务
        for _ in range(tasks_per_project):
            tasks_data.append((
                project_id,
                f"任务阶段-{random.randint(1, 5)}: {fake.catch_phrase()}",
                random.choice(user_ids),
                random.choice(['todo', 'in_progress', 'done'])
            ))
        # 生成记录
        for _ in range(records_per_project):
            records_data.append((
                project_id,
                random.choice(user_ids),
                fake.paragraph(nb_sentences=5),
                fake.date_time_this_year()
            ))

    sql_tasks = "INSERT INTO project_tasks (project_id, name, assigned_to_user_id, status) VALUES (%s, %s, %s, %s)"
    cursor.executemany(sql_tasks, tasks_data)

    sql_records = "INSERT INTO experiment_records (project_id, user_id, content, record_time) VALUES (%s, %s, %s, %s)"
    cursor.executemany(sql_records, records_data)


def generate_requests(cursor, user_ids, equipment_ids, lab_ids, material_ids, count):
    print(f"  ↳ 正在生成 {count} 条资源申请...")
    requests_data = []
    for _ in range(count):
        req_type = random.choice(['equipment', 'lab', 'material'])
        resource_id = None
        if req_type == 'equipment': resource_id = random.choice(equipment_ids)
        if req_type == 'lab': resource_id = random.choice(lab_ids)
        if req_type == 'material': resource_id = random.choice(material_ids)

        start_time = fake.date_time_between(start_date='-30d', end_date='+30d')
        requests_data.append((
            random.choice(user_ids),
            req_type,
            resource_id,
            round(random.uniform(1, 10), 2) if req_type == 'material' else None,
            start_time,
            start_time + timedelta(hours=random.randint(1, 8)),
            fake.sentence(),
            random.choice(['pending_approval', 'approved', 'rejected', 'completed']),
            random.choice(user_ids)  # 随机指定审批人
        ))
    sql = """
          INSERT INTO resource_requests
          (user_id, request_type, resource_id, quantity, start_time, end_time, purpose, status, approver_id)
          VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) \
          """
    cursor.executemany(sql, requests_data)


def generate_incidents(cursor, user_ids, lab_ids, count):
    print(f"  ↳ 正在生成 {count} 条安全事故记录...")
    incidents_data = []
    for _ in range(count):
        incidents_data.append((
            random.choice(lab_ids),
            random.choice(user_ids),
            fake.date_time_this_year(),
            f"事故描述: {fake.sentence()}",
            f"处理措施: {fake.sentence()}"
        ))
    sql = "INSERT INTO safety_incidents (lab_id, reported_by_user_id, incident_time, description, actions_taken) VALUES (%s, %s, %s, %s, %s)"
    cursor.executemany(sql, incidents_data)


if __name__ == '__main__':
    populate_data()
