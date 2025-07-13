# ExperimentReportControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createNewVersion**](#createnewversion) | **PUT** /api/v1/experiment-reports/{id}/versions | |
|[**createReport**](#createreport) | **POST** /api/v1/experiment-reports | |
|[**getReportById**](#getreportbyid) | **GET** /api/v1/experiment-reports/{id} | |

# **createNewVersion**
> ApiResponseExperimentReportVO createNewVersion(reportVersionCreateDTO)


### Example

```typescript
import {
    ExperimentReportControllerApi,
    Configuration,
    ReportVersionCreateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ExperimentReportControllerApi(configuration);

let id: number; // (default to undefined)
let reportVersionCreateDTO: ReportVersionCreateDTO; //

const { status, data } = await apiInstance.createNewVersion(
    id,
    reportVersionCreateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reportVersionCreateDTO** | **ReportVersionCreateDTO**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseExperimentReportVO**

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

# **createReport**
> ApiResponseExperimentReportVO createReport(experimentReportCreateDTO)


### Example

```typescript
import {
    ExperimentReportControllerApi,
    Configuration,
    ExperimentReportCreateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ExperimentReportControllerApi(configuration);

let experimentReportCreateDTO: ExperimentReportCreateDTO; //

const { status, data } = await apiInstance.createReport(
    experimentReportCreateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **experimentReportCreateDTO** | **ExperimentReportCreateDTO**|  | |


### Return type

**ApiResponseExperimentReportVO**

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

# **getReportById**
> ApiResponseExperimentReportVO getReportById()


### Example

```typescript
import {
    ExperimentReportControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ExperimentReportControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getReportById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseExperimentReportVO**

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

