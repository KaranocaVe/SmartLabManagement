# ResourceRequestControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**approveResourceRequest**](#approveresourcerequest) | **PUT** /api/v1/resource-requests/approval | |
|[**createResourceRequest**](#createresourcerequest) | **POST** /api/v1/resource-requests | |
|[**getRequestById**](#getrequestbyid) | **GET** /api/v1/resource-requests/{id} | |
|[**getRequests**](#getrequests) | **GET** /api/v1/resource-requests | |

# **approveResourceRequest**
> ApiResponseResourceRequestVO approveResourceRequest(resourceRequestApproveDTO)


### Example

```typescript
import {
    ResourceRequestControllerApi,
    Configuration,
    ResourceRequestApproveDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ResourceRequestControllerApi(configuration);

let resourceRequestApproveDTO: ResourceRequestApproveDTO; //

const { status, data } = await apiInstance.approveResourceRequest(
    resourceRequestApproveDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resourceRequestApproveDTO** | **ResourceRequestApproveDTO**|  | |


### Return type

**ApiResponseResourceRequestVO**

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

# **createResourceRequest**
> ApiResponseResourceRequestVO createResourceRequest(resourceRequestCreateDTO)


### Example

```typescript
import {
    ResourceRequestControllerApi,
    Configuration,
    ResourceRequestCreateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ResourceRequestControllerApi(configuration);

let resourceRequestCreateDTO: ResourceRequestCreateDTO; //

const { status, data } = await apiInstance.createResourceRequest(
    resourceRequestCreateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resourceRequestCreateDTO** | **ResourceRequestCreateDTO**|  | |


### Return type

**ApiResponseResourceRequestVO**

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

# **getRequestById**
> ApiResponseResourceRequestVO getRequestById()


### Example

```typescript
import {
    ResourceRequestControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ResourceRequestControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getRequestById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseResourceRequestVO**

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

# **getRequests**
> ApiResponseIPageResourceRequestVO getRequests()


### Example

```typescript
import {
    ResourceRequestControllerApi,
    Configuration,
    ResourceRequestQueryDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ResourceRequestControllerApi(configuration);

let queryDTO: ResourceRequestQueryDTO; // (default to undefined)

const { status, data } = await apiInstance.getRequests(
    queryDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **queryDTO** | **ResourceRequestQueryDTO** |  | defaults to undefined|


### Return type

**ApiResponseIPageResourceRequestVO**

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

