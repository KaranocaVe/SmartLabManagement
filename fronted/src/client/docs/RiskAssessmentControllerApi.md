# RiskAssessmentControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAssessment**](#createassessment) | **POST** /api/v1/risk-assessments | |
|[**getAssessmentById**](#getassessmentbyid) | **GET** /api/v1/risk-assessments/{id} | |
|[**getAssessmentsByProjectId**](#getassessmentsbyprojectid) | **GET** /api/v1/risk-assessments/project/{projectId} | |

# **createAssessment**
> ApiResponseRiskAssessmentVO createAssessment(riskAssessmentCreateDTO)


### Example

```typescript
import {
    RiskAssessmentControllerApi,
    Configuration,
    RiskAssessmentCreateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new RiskAssessmentControllerApi(configuration);

let riskAssessmentCreateDTO: RiskAssessmentCreateDTO; //

const { status, data } = await apiInstance.createAssessment(
    riskAssessmentCreateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **riskAssessmentCreateDTO** | **RiskAssessmentCreateDTO**|  | |


### Return type

**ApiResponseRiskAssessmentVO**

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

# **getAssessmentById**
> ApiResponseRiskAssessmentVO getAssessmentById()


### Example

```typescript
import {
    RiskAssessmentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RiskAssessmentControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getAssessmentById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseRiskAssessmentVO**

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

# **getAssessmentsByProjectId**
> ApiResponseListRiskAssessmentVO getAssessmentsByProjectId()


### Example

```typescript
import {
    RiskAssessmentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RiskAssessmentControllerApi(configuration);

let projectId: number; // (default to undefined)

const { status, data } = await apiInstance.getAssessmentsByProjectId(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseListRiskAssessmentVO**

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

