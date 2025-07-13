# MaterialControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adjustStock**](#adjuststock) | **POST** /api/v1/materials/stock-adjustment | |
|[**createMaterial**](#creatematerial) | **POST** /api/v1/materials | |
|[**getMaterialPage**](#getmaterialpage) | **GET** /api/v1/materials | |
|[**updateMaterial**](#updatematerial) | **PUT** /api/v1/materials/{id} | |

# **adjustStock**
> ApiResponseVoid adjustStock(materialStockAdjustDTO)


### Example

```typescript
import {
    MaterialControllerApi,
    Configuration,
    MaterialStockAdjustDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new MaterialControllerApi(configuration);

let materialStockAdjustDTO: MaterialStockAdjustDTO; //

const { status, data } = await apiInstance.adjustStock(
    materialStockAdjustDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **materialStockAdjustDTO** | **MaterialStockAdjustDTO**|  | |


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

# **createMaterial**
> ApiResponseMaterial createMaterial(material)


### Example

```typescript
import {
    MaterialControllerApi,
    Configuration,
    Material
} from './api';

const configuration = new Configuration();
const apiInstance = new MaterialControllerApi(configuration);

let material: Material; //

const { status, data } = await apiInstance.createMaterial(
    material
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **material** | **Material**|  | |


### Return type

**ApiResponseMaterial**

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

# **getMaterialPage**
> ApiResponseIPageMaterial getMaterialPage()


### Example

```typescript
import {
    MaterialControllerApi,
    Configuration,
    PageRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new MaterialControllerApi(configuration);

let pageRequestDTO: PageRequestDTO; // (default to undefined)

const { status, data } = await apiInstance.getMaterialPage(
    pageRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageRequestDTO** | **PageRequestDTO** |  | defaults to undefined|


### Return type

**ApiResponseIPageMaterial**

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

# **updateMaterial**
> ApiResponseMaterial updateMaterial(material)


### Example

```typescript
import {
    MaterialControllerApi,
    Configuration,
    Material
} from './api';

const configuration = new Configuration();
const apiInstance = new MaterialControllerApi(configuration);

let id: number; // (default to undefined)
let material: Material; //

const { status, data } = await apiInstance.updateMaterial(
    id,
    material
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **material** | **Material**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseMaterial**

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

