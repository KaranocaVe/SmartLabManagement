# SafetyIncidentControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getIncidentById**](#getincidentbyid) | **GET** /api/v1/safety-incidents/{id} | |
|[**getIncidentPage**](#getincidentpage) | **GET** /api/v1/safety-incidents | |
|[**recordIncident**](#recordincident) | **POST** /api/v1/safety-incidents | |

# **getIncidentById**
> ApiResponseSafetyIncidentVO getIncidentById()


### Example

```typescript
import {
    SafetyIncidentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SafetyIncidentControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getIncidentById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseSafetyIncidentVO**

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

# **getIncidentPage**
> ApiResponseIPageSafetyIncidentVO getIncidentPage()


### Example

```typescript
import {
    SafetyIncidentControllerApi,
    Configuration,
    PageRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new SafetyIncidentControllerApi(configuration);

let pageRequestDTO: PageRequestDTO; // (default to undefined)

const { status, data } = await apiInstance.getIncidentPage(
    pageRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageRequestDTO** | **PageRequestDTO** |  | defaults to undefined|


### Return type

**ApiResponseIPageSafetyIncidentVO**

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

# **recordIncident**
> ApiResponseSafetyIncidentVO recordIncident(safetyIncidentCreateDTO)


### Example

```typescript
import {
    SafetyIncidentControllerApi,
    Configuration,
    SafetyIncidentCreateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new SafetyIncidentControllerApi(configuration);

let safetyIncidentCreateDTO: SafetyIncidentCreateDTO; //

const { status, data } = await apiInstance.recordIncident(
    safetyIncidentCreateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **safetyIncidentCreateDTO** | **SafetyIncidentCreateDTO**|  | |


### Return type

**ApiResponseSafetyIncidentVO**

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

