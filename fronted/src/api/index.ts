import apiClient from './client';

// 从您项目 `src/client/api.ts` 文件中导入由OpenAPI Generator生成的API工厂函数
// 注意：这里的导入路径和名称需要与您实际生成的文件完全匹配
import {
    AttachmentControllerApiFactory,
    AuthControllerApiFactory,
    EquipmentControllerApiFactory,
    ExperimentRecordControllerApiFactory,
    ExperimentReportControllerApiFactory,
    LabControllerApiFactory,
    MaterialControllerApiFactory,
    PermissionControllerApiFactory,
    ProjectControllerApiFactory,
    ProjectTaskControllerApiFactory,
    ResourceRequestControllerApiFactory,
    RiskAssessmentControllerApiFactory,
    RoleControllerApiFactory,
    SafetyIncidentControllerApiFactory,
    SupplierControllerApiFactory,
    UserControllerApiFactory,
} from '../client';

// OpenAPI Generator生成的工厂函数通常需要这三个参数
const configuration = undefined; // 我们不需要额外的配置，因为axios实例已经配置好了
const basePath = '/api';         // 基础路径，与我们的代理设置一致
const axiosInstance = apiClient; // 关键一步：传入我们自定义的axios实例

// --- 创建并导出所有API模块的实例 ---
// 后续在项目中，我们就可以像这样使用：`import { authApi } from '@/api';`
export const attachmentApi = AttachmentControllerApiFactory(configuration, basePath, axiosInstance);
export const authApi = AuthControllerApiFactory(configuration, basePath, axiosInstance);
export const equipmentApi = EquipmentControllerApiFactory(configuration, basePath, axiosInstance);
export const experimentRecordApi = ExperimentRecordControllerApiFactory(configuration, basePath, axiosInstance);
export const experimentReportApi = ExperimentReportControllerApiFactory(configuration, basePath, axiosInstance);
export const labApi = LabControllerApiFactory(configuration, basePath, axiosInstance);
export const materialApi = MaterialControllerApiFactory(configuration, basePath, axiosInstance);
export const permissionApi = PermissionControllerApiFactory(configuration, basePath, axiosInstance);
export const projectApi = ProjectControllerApiFactory(configuration, basePath, axiosInstance);
export const projectTaskApi = ProjectTaskControllerApiFactory(configuration, basePath, axiosInstance);
export const resourceRequestApi = ResourceRequestControllerApiFactory(configuration, basePath, axiosInstance);
export const riskAssessmentApi = RiskAssessmentControllerApiFactory(configuration, basePath, axiosInstance);
export const roleApi = RoleControllerApiFactory(configuration, basePath, axiosInstance);
export const safetyIncidentApi = SafetyIncidentControllerApiFactory(configuration, basePath, axiosInstance);
export const supplierApi = SupplierControllerApiFactory(configuration, basePath, axiosInstance);
export const userApi = UserControllerApiFactory(configuration, basePath, axiosInstance);
