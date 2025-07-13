# ProjectVO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**projectLeadId** | **number** |  | [optional] [default to undefined]
**projectLeadName** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**startDate** | **string** |  | [optional] [default to undefined]
**endDate** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**members** | [**Array&lt;ProjectMemberVO&gt;**](ProjectMemberVO.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ProjectVO } from './api';

const instance: ProjectVO = {
    id,
    name,
    description,
    projectLeadId,
    projectLeadName,
    status,
    startDate,
    endDate,
    createdAt,
    members,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
