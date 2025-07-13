# RoleControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**assignPermissionsToRole**](#assignpermissionstorole) | **POST** /api/v1/roles/assign-permissions | |
|[**createRole**](#createrole) | **POST** /api/v1/roles | |
|[**getAllRoles**](#getallroles) | **GET** /api/v1/roles | |

# **assignPermissionsToRole**
> ApiResponseVoid assignPermissionsToRole(assignPermissionsToRoleDTO)


### Example

```typescript
import {
    RoleControllerApi,
    Configuration,
    AssignPermissionsToRoleDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

let assignPermissionsToRoleDTO: AssignPermissionsToRoleDTO; //

const { status, data } = await apiInstance.assignPermissionsToRole(
    assignPermissionsToRoleDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignPermissionsToRoleDTO** | **AssignPermissionsToRoleDTO**|  | |


### Return type

**ApiResponseVoid**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**500** | Internal Server Error |  -  |
|**400** | Bad Request |  -  |
|**403** | Forbidden |  -  |
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createRole**
> ApiResponseRole createRole(roleCreateDTO)


### Example

```typescript
import {
    RoleControllerApi,
    Configuration,
    RoleCreateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

let roleCreateDTO: RoleCreateDTO; //

const { status, data } = await apiInstance.createRole(
    roleCreateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleCreateDTO** | **RoleCreateDTO**|  | |


### Return type

**ApiResponseRole**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**500** | Internal Server Error |  -  |
|**400** | Bad Request |  -  |
|**403** | Forbidden |  -  |
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllRoles**
> ApiResponseListRole getAllRoles()


### Example

```typescript
import {
    RoleControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoleControllerApi(configuration);

const { status, data } = await apiInstance.getAllRoles();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResponseListRole**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**500** | Internal Server Error |  -  |
|**400** | Bad Request |  -  |
|**403** | Forbidden |  -  |
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

