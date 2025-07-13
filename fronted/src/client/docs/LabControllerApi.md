# LabControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createLab**](#createlab) | **POST** /api/v1/labs | |
|[**deleteLab**](#deletelab) | **DELETE** /api/v1/labs/{id} | |
|[**getLabById**](#getlabbyid) | **GET** /api/v1/labs/{id} | |
|[**getLabPage**](#getlabpage) | **GET** /api/v1/labs | |
|[**updateLab**](#updatelab) | **PUT** /api/v1/labs/{id} | |

# **createLab**
> ApiResponseLab createLab(lab)


### Example

```typescript
import {
    LabControllerApi,
    Configuration,
    Lab
} from './api';

const configuration = new Configuration();
const apiInstance = new LabControllerApi(configuration);

let lab: Lab; //

const { status, data } = await apiInstance.createLab(
    lab
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **lab** | **Lab**|  | |


### Return type

**ApiResponseLab**

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

# **deleteLab**
> ApiResponseVoid deleteLab()


### Example

```typescript
import {
    LabControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LabControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteLab(
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

# **getLabById**
> ApiResponseLab getLabById()


### Example

```typescript
import {
    LabControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LabControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getLabById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseLab**

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

# **getLabPage**
> ApiResponseIPageLab getLabPage()


### Example

```typescript
import {
    LabControllerApi,
    Configuration,
    PageRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new LabControllerApi(configuration);

let pageRequestDTO: PageRequestDTO; // (default to undefined)

const { status, data } = await apiInstance.getLabPage(
    pageRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageRequestDTO** | **PageRequestDTO** |  | defaults to undefined|


### Return type

**ApiResponseIPageLab**

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

# **updateLab**
> ApiResponseLab updateLab(lab)


### Example

```typescript
import {
    LabControllerApi,
    Configuration,
    Lab
} from './api';

const configuration = new Configuration();
const apiInstance = new LabControllerApi(configuration);

let id: number; // (default to undefined)
let lab: Lab; //

const { status, data } = await apiInstance.updateLab(
    id,
    lab
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **lab** | **Lab**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseLab**

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

