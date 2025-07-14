import React from "react";
import { Box } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
  type GridPaginationModel,
  type GridRowId,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

// --- 定义组件的Props接口 ---

// T 泛型代表表格行数据的类型 (例如 Supplier, User)
interface DataTableProps<T> {
  rows: T[];
  columns: GridColDef[];
  loading: boolean;
  rowCount: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onEdit?: (row: T) => void; // 编辑操作的回调函数
  onDelete?: (id: GridRowId) => void; // 删除操作的回调函数
}

/**
 * 通用数据表格组件
 * @description 一个封装了MUI DataGrid的、支持服务器端分页、加载状态和通用操作的可复用组件。
 * @template T - 表格行数据的类型
 */
const DataTable = <T extends { id: GridRowId }>({
  rows,
  columns,
  loading,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  onEdit,
  onDelete,
}: DataTableProps<T>) => {
  // --- 动态构建列定义 ---

  // 复制一份列定义，以避免直接修改传入的props
  const memoizedColumns = React.useMemo(() => {
    const actionCol: GridColDef = {
      field: "actions",
      type: "actions",
      headerName: "操作",
      width: 100,
      cellClassName: "actions",
      getActions: ({ row }) => {
        const actions = [];
        if (onEdit) {
          actions.push(
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon />}
              label="Edit"
              onClick={() => onEdit(row as T)}
              color="inherit"
            />
          );
        }
        if (onDelete) {
          actions.push(
            <GridActionsCellItem
              key="delete"
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => onDelete(row.id)}
              color="inherit"
            />
          );
        }
        return actions;
      },
    };

    // 如果提供了 onEdit 或 onDelete 回调，则在列的末尾添加“操作”列
    if (onEdit || onDelete) {
      return [...columns, actionCol];
    }
    return columns;
  }, [columns, onEdit, onDelete]);

  return (
    <Box
      sx={{
        height: 650,
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DataGrid
        rows={rows}
        columns={memoizedColumns}
        loading={loading}
        pagination
        paginationMode="server"
        rowCount={rowCount}
        pageSizeOptions={[5, 10, 20]}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
        rowHeight={40} // 设置行高为 40px
        sortingOrder={["asc", "desc"]} // 仅允许升序和降序
        localeText={{
          columnMenuSortAsc: "升序",
          columnMenuSortDesc: "降序",
          columnHeaderSortIconLabel: "排序",
          columnMenuFilter: "筛选",
          columnMenuHideColumn: "隐藏列",
          columnMenuShowColumns: "显示列",
          columnMenuManageColumns: "管理列",
        }}
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
            fontSize: "0.875rem",
            lineHeight: "1.5rem",
            "&:hover": {
              cursor: "pointer",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            },
          },
          "& .MuiDataGrid-cell": {
            fontSize: "0.875rem",
            padding: "4px 8px",
          },
        }}
      />
    </Box>
  );
};

export default DataTable;
