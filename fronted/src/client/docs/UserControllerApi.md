# UserControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**assignRolesToUser**](#assignrolestouser) | **POST** /api/v1/users/assign-roles | |
|[**createUser**](#createuser) | **POST** /api/v1/users | |
|[**deleteUser**](#deleteuser) | **DELETE** /api/v1/users/{id} | |
|[**getUserById**](#getuserbyid) | **GET** /api/v1/users/{id} | |
|[**getUserPage**](#getuserpage) | **GET** /api/v1/users | |
|[**updateUser**](#updateuser) | **PUT** /api/v1/users/{id} | |

# **assignRolesToUser**
> ApiResponseVoid assignRolesToUser(assignRolesToUserDTO)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    AssignRolesToUserDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let assignRolesToUserDTO: AssignRolesToUserDTO; //

const { status, data } = await apiInstance.assignRolesToUser(
    assignRolesToUserDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignRolesToUserDTO** | **AssignRolesToUserDTO**|  | |


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

# **createUser**
> ApiResponseUserVO createUser(userCreateDTO)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    UserCreateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let userCreateDTO: UserCreateDTO; //

const { status, data } = await apiInstance.createUser(
    userCreateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userCreateDTO** | **UserCreateDTO**|  | |


### Return type

**ApiResponseUserVO**

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

# **deleteUser**
> ApiResponseVoid deleteUser()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteUser(
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

# **getUserById**
> ApiResponseUserVO getUserById()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getUserById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseUserVO**

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

# **getUserPage**
> ApiResponseIPageUserVO getUserPage()


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    PageRequestDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let pageRequestDTO: PageRequestDTO; // (default to undefined)

const { status, data } = await apiInstance.getUserPage(
    pageRequestDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageRequestDTO** | **PageRequestDTO** |  | defaults to undefined|


### Return type

**ApiResponseIPageUserVO**

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

# **updateUser**
> ApiResponseUserVO updateUser(userUpdateDTO)


### Example

```typescript
import {
    UserControllerApi,
    Configuration,
    UserUpdateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

let id: number; // (default to undefined)
let userUpdateDTO: UserUpdateDTO; //

const { status, data } = await apiInstance.updateUser(
    id,
    userUpdateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userUpdateDTO** | **UserUpdateDTO**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseUserVO**

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

