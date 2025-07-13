# AttachmentControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**uploadAttachment**](#uploadattachment) | **POST** /api/v1/attachments/upload | |

# **uploadAttachment**
> ApiResponseAttachmentVO uploadAttachment()


### Example

```typescript
import {
    AttachmentControllerApi,
    Configuration,
    UploadAttachmentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AttachmentControllerApi(configuration);

let parentType: string; // (default to undefined)
let parentId: number; // (default to undefined)
let uploadAttachmentRequest: UploadAttachmentRequest; // (optional)

const { status, data } = await apiInstance.uploadAttachment(
    parentType,
    parentId,
    uploadAttachmentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uploadAttachmentRequest** | **UploadAttachmentRequest**|  | |
| **parentType** | [**string**] |  | defaults to undefined|
| **parentId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseAttachmentVO**

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

