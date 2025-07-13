# ProjectControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addMemberToProject**](#addmembertoproject) | **POST** /api/v1/projects/members | |
|[**createProject**](#createproject) | **POST** /api/v1/projects | |
|[**deleteProject**](#deleteproject) | **DELETE** /api/v1/projects/{id} | |
|[**getProjectById**](#getprojectbyid) | **GET** /api/v1/projects/{id} | |
|[**getProjectPage**](#getprojectpage) | **GET** /api/v1/projects | |
|[**removeMemberFromProject**](#removememberfromproject) | **DELETE** /api/v1/projects/{projectId}/members/{userId} | |
|[**updateProject**](#updateproject) | **PUT** /api/v1/projects/{id} | |

# **addMemberToProject**
> ApiResponseVoid addMemberToProject(addProjectMemberDTO)


### Example

```typescript
import {
    ProjectControllerApi,
    Configuration,
    AddProjectMemberDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectControllerApi(configuration);

let addProjectMemberDTO: AddProjectMemberDTO; //

const { status, data } = await apiInstance.addMemberToProject(
    addProjectMemberDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addProjectMemberDTO** | **AddProjectMemberDTO**|  | |


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

# **createProject**
> ApiResponseProjectVO createProject(projectCreateDTO)


### Example

```typescript
import {
    ProjectControllerApi,
    Configuration,
    ProjectCreateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectControllerApi(configuration);

let projectCreateDTO: ProjectCreateDTO; //

const { status, data } = await apiInstance.createProject(
    projectCreateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectCreateDTO** | **ProjectCreateDTO**|  | |


### Return type

**ApiResponseProjectVO**

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

# **deleteProject**
> ApiResponseVoid deleteProject()


### Example

```typescript
import {
    ProjectControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteProject(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseVoid**

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

# **getProjectById**
> ApiResponseProjectVO getProjectById()


### Example

```typescript
import {
    ProjectControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getProjectById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseProjectVO**

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

# **getProjectPage**
> ApiResponseIPageProjectVO getProjectPage()


### Example

```typescript
import {
    ProjectControllerApi,
    Configuration,
    PageRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectControllerApi(configuration);

let pageRequestDTO: PageRequestDTO; // (default to undefined)

const { status, data } = await apiInstance.getProjectPage(
    pageRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageRequestDTO** | **PageRequestDTO** |  | defaults to undefined|


### Return type

**ApiResponseIPageProjectVO**

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

# **removeMemberFromProject**
> ApiResponseVoid removeMemberFromProject()


### Example

```typescript
import {
    ProjectControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectControllerApi(configuration);

let projectId: number; // (default to undefined)
let userId: number; // (default to undefined)

const { status, data } = await apiInstance.removeMemberFromProject(
    projectId,
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**number**] |  | defaults to undefined|
| **userId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseVoid**

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

# **updateProject**
> ApiResponseProjectVO updateProject(projectUpdateDTO)


### Example

```typescript
import {
    ProjectControllerApi,
    Configuration,
    ProjectUpdateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectControllerApi(configuration);

let id: number; // (default to undefined)
let projectUpdateDTO: ProjectUpdateDTO; //

const { status, data } = await apiInstance.updateProject(
    id,
    projectUpdateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectUpdateDTO** | **ProjectUpdateDTO**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseProjectVO**

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

