# EquipmentControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createEquipment**](#createequipment) | **POST** /api/v1/equipment | |
|[**getEquipmentById**](#getequipmentbyid) | **GET** /api/v1/equipment/{id} | |
|[**getEquipmentPage**](#getequipmentpage) | **GET** /api/v1/equipment | |
|[**recordMaintenance**](#recordmaintenance) | **POST** /api/v1/equipment/{id}/maintenance | |
|[**updateEquipment**](#updateequipment) | **PUT** /api/v1/equipment/{id} | |

# **createEquipment**
> ApiResponseEquipment createEquipment(equipmentCreateDTO)


### Example

```typescript
import {
    EquipmentControllerApi,
    Configuration,
    EquipmentCreateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new EquipmentControllerApi(configuration);

let equipmentCreateDTO: EquipmentCreateDTO; //

const { status, data } = await apiInstance.createEquipment(
    equipmentCreateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **equipmentCreateDTO** | **EquipmentCreateDTO**|  | |


### Return type

**ApiResponseEquipment**

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

# **getEquipmentById**
> ApiResponseEquipment getEquipmentById()


### Example

```typescript
import {
    EquipmentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EquipmentControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getEquipmentById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseEquipment**

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

# **getEquipmentPage**
> ApiResponseIPageEquipment getEquipmentPage()


### Example

```typescript
import {
    EquipmentControllerApi,
    Configuration,
    PageRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new EquipmentControllerApi(configuration);

let pageRequestDTO: PageRequestDTO; // (default to undefined)

const { status, data } = await apiInstance.getEquipmentPage(
    pageRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageRequestDTO** | **PageRequestDTO** |  | defaults to undefined|


### Return type

**ApiResponseIPageEquipment**

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

# **recordMaintenance**
> ApiResponseVoid recordMaintenance(body)


### Example

```typescript
import {
    EquipmentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EquipmentControllerApi(configuration);

let id: number; // (default to undefined)
let body: string; //

const { status, data } = await apiInstance.recordMaintenance(
    id,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **string**|  | |
| **id** | [**number**] |  | defaults to undefined|


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

# **updateEquipment**
> ApiResponseEquipment updateEquipment(equipment)


### Example

```typescript
import {
    EquipmentControllerApi,
    Configuration,
    Equipment
} from './api';

const configuration = new Configuration();
const apiInstance = new EquipmentControllerApi(configuration);

let id: number; // (default to undefined)
let equipment: Equipment; //

const { status, data } = await apiInstance.updateEquipment(
    id,
    equipment
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **equipment** | **Equipment**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseEquipment**

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

