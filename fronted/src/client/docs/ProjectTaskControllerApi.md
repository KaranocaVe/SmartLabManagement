# ProjectTaskControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createTask**](#createtask) | **POST** /api/v1/project-tasks | |
|[**deleteTask**](#deletetask) | **DELETE** /api/v1/project-tasks/{id} | |
|[**getTasksByProjectId**](#gettasksbyprojectid) | **GET** /api/v1/project-tasks/project/{projectId} | |
|[**updateTask**](#updatetask) | **PUT** /api/v1/project-tasks/{id} | |

# **createTask**
> ApiResponseProjectTask createTask(projectTaskCreateDTO)


### Example

```typescript
import {
    ProjectTaskControllerApi,
    Configuration,
    ProjectTaskCreateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectTaskControllerApi(configuration);

let projectTaskCreateDTO: ProjectTaskCreateDTO; //

const { status, data } = await apiInstance.createTask(
    projectTaskCreateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectTaskCreateDTO** | **ProjectTaskCreateDTO**|  | |


### Return type

**ApiResponseProjectTask**

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

# **deleteTask**
> ApiResponseVoid deleteTask()


### Example

```typescript
import {
    ProjectTaskControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectTaskControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteTask(
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

# **getTasksByProjectId**
> ApiResponseListProjectTask getTasksByProjectId()


### Example

```typescript
import {
    ProjectTaskControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectTaskControllerApi(configuration);

let projectId: number; // (default to undefined)

const { status, data } = await apiInstance.getTasksByProjectId(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseListProjectTask**

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

# **updateTask**
> ApiResponseProjectTask updateTask(projectTaskUpdateDTO)


### Example

```typescript
import {
    ProjectTaskControllerApi,
    Configuration,
    ProjectTaskUpdateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectTaskControllerApi(configuration);

let id: number; // (default to undefined)
let projectTaskUpdateDTO: ProjectTaskUpdateDTO; //

const { status, data } = await apiInstance.updateTask(
    id,
    projectTaskUpdateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectTaskUpdateDTO** | **ProjectTaskUpdateDTO**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseProjectTask**

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

