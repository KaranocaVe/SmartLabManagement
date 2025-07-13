# PermissionControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllPermissions**](#getallpermissions) | **GET** /api/v1/permissions | |

# **getAllPermissions**
> ApiResponseListPermission getAllPermissions()


### Example

```typescript
import {
    PermissionControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PermissionControllerApi(configuration);

const { status, data } = await apiInstance.getAllPermissions();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResponseListPermission**

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

