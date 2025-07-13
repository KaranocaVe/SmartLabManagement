# SupplierControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createSupplier**](#createsupplier) | **POST** /api/v1/suppliers | |
|[**deleteSupplier**](#deletesupplier) | **DELETE** /api/v1/suppliers/{id} | |
|[**getSupplierById**](#getsupplierbyid) | **GET** /api/v1/suppliers/{id} | |
|[**getSupplierPage**](#getsupplierpage) | **GET** /api/v1/suppliers | |
|[**updateSupplier**](#updatesupplier) | **PUT** /api/v1/suppliers/{id} | |

# **createSupplier**
> ApiResponseSupplier createSupplier(supplier)


### Example

```typescript
import {
    SupplierControllerApi,
    Configuration,
    Supplier
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierControllerApi(configuration);

let supplier: Supplier; //

const { status, data } = await apiInstance.createSupplier(
    supplier
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **supplier** | **Supplier**|  | |


### Return type

**ApiResponseSupplier**

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

# **deleteSupplier**
> ApiResponseVoid deleteSupplier()


### Example

```typescript
import {
    SupplierControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteSupplier(
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

# **getSupplierById**
> ApiResponseSupplier getSupplierById()


### Example

```typescript
import {
    SupplierControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getSupplierById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseSupplier**

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

# **getSupplierPage**
> ApiResponseIPageSupplier getSupplierPage()


### Example

```typescript
import {
    SupplierControllerApi,
    Configuration,
    PageRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierControllerApi(configuration);

let pageRequestDTO: PageRequestDTO; // (default to undefined)

const { status, data } = await apiInstance.getSupplierPage(
    pageRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageRequestDTO** | **PageRequestDTO** |  | defaults to undefined|


### Return type

**ApiResponseIPageSupplier**

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

# **updateSupplier**
> ApiResponseSupplier updateSupplier(supplier)


### Example

```typescript
import {
    SupplierControllerApi,
    Configuration,
    Supplier
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierControllerApi(configuration);

let id: number; // (default to undefined)
let supplier: Supplier; //

const { status, data } = await apiInstance.updateSupplier(
    id,
    supplier
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **supplier** | **Supplier**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseSupplier**

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

