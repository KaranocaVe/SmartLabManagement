import apiClient from './client';

// 从您项目 `src/client/api.ts` 文件中导入由OpenAPI Generator生成的API工厂函数
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
    LogControllerApiFactory
} from '../client';

// --- 修正点 ---
// 我们不再需要一个独立的basePath变量，因为baseURL已经在apiClient中定义好了。
// 将传递给工厂函数的basePath参数设置为空字符串或undefined，
// 以避免与axios实例的baseURL重复。
const configuration = undefined;
const basePath = undefined; // 或者 const basePath = '';
const axiosInstance = apiClient;

// --- 创建并导出所有API模块的实例 ---
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
export const logApi = LogControllerApiFactory(configuration, basePath, axiosInstance);
