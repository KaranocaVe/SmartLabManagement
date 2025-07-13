# ExperimentRecordControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createExperimentRecord**](#createexperimentrecord) | **POST** /api/v1/experiment-records | |
|[**getRecordById**](#getrecordbyid) | **GET** /api/v1/experiment-records/{id} | |
|[**getRecordsByProjectId**](#getrecordsbyprojectid) | **GET** /api/v1/experiment-records/project/{projectId} | |

# **createExperimentRecord**
> ApiResponseExperimentRecord createExperimentRecord(experimentRecordCreateDTO)


### Example

```typescript
import {
    ExperimentRecordControllerApi,
    Configuration,
    ExperimentRecordCreateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ExperimentRecordControllerApi(configuration);

let experimentRecordCreateDTO: ExperimentRecordCreateDTO; //

const { status, data } = await apiInstance.createExperimentRecord(
    experimentRecordCreateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **experimentRecordCreateDTO** | **ExperimentRecordCreateDTO**|  | |


### Return type

**ApiResponseExperimentRecord**

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

# **getRecordById**
> ApiResponseExperimentRecord getRecordById()


### Example

```typescript
import {
    ExperimentRecordControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ExperimentRecordControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getRecordById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseExperimentRecord**

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

# **getRecordsByProjectId**
> ApiResponseIPageExperimentRecord getRecordsByProjectId()


### Example

```typescript
import {
    ExperimentRecordControllerApi,
    Configuration,
    PageRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ExperimentRecordControllerApi(configuration);

let projectId: number; // (default to undefined)
let pageRequestDTO: PageRequestDTO; // (default to undefined)

const { status, data } = await apiInstance.getRecordsByProjectId(
    projectId,
    pageRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**number**] |  | defaults to undefined|
| **pageRequestDTO** | **PageRequestDTO** |  | defaults to undefined|


### Return type

**ApiResponseIPageExperimentRecord**

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

