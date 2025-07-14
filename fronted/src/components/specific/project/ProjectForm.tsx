import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from '@mui/material';

// 导入项目相关的API类型
import type { ProjectCreateDTO, ProjectUpdateDTO, ProjectVO } from '../../../client/api';

// 定义组件的Props接口
interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectCreateDTO | ProjectUpdateDTO) => void;
  initialData?: ProjectVO | null;
}

// 定义表单的数据类型
type FormValues = {
  name: string;
  description?: string;
  projectLeadId: number;
  startDate?: string;
  endDate?: string;
};

/**
 * 项目创建/编辑表单组件
 */
const ProjectForm: React.FC<ProjectFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const isEditMode = !!initialData;

  useEffect(() => {
    if (open) {
      if (initialData) {
        // 编辑模式
        reset({
          ...initialData,
          startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
          endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        });
      } else {
        // 新增模式
        reset({
          name: '',
          description: '',
          projectLeadId: undefined,
          startDate: '',
          endDate: '',
        });
      }
    }
  }, [initialData, open, reset]);

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    const processedData = {
      ...data,
      projectLeadId: Number(data.projectLeadId),
      startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
    };
    if (isEditMode) {
      onSubmit({ id: initialData.id, ...processedData });
    } else {
      onSubmit(processedData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? '编辑项目' : '创建新项目'}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }} component="div">
              <TextField {...register('name', { required: '项目名称是必填项' })} label="项目名称" fullWidth required error={!!errors.name} helperText={errors.name?.message} />
            </Grid>
            <Grid size={{ xs: 12 }} component="div">
              <TextField {...register('projectLeadId', { required: '项目负责人ID是必填项' })} label="项目负责人ID" type="number" fullWidth required error={!!errors.projectLeadId} helperText={errors.projectLeadId?.message} />
            </Grid>
            <Grid size={{ xs: 12 }} component="div">
              <TextField {...register('description')} label="项目描述" fullWidth multiline rows={4} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} component="div">
              <TextField {...register('startDate')} label="开始日期" type="date" InputLabelProps={{ shrink: true }} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} component="div">
              <TextField {...register('endDate')} label="结束日期" type="date" InputLabelProps={{ shrink: true }} fullWidth />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={onClose} disabled={isSubmitting}>取消</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? '创建中...' : '确认创建'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectForm;
