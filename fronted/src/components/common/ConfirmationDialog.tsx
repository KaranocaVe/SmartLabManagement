import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
} from '@mui/material';
import type {TransitionProps} from '@mui/material/transitions';

// 定义一个向上的滑动过渡效果，让弹窗出现得更平滑
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// --- 定义组件的Props接口 ---
interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    content: string;
}

/**
 * 通用二次确认弹窗组件
 * @description 用于在执行关键操作（如删除）前，向用户请求最终确认。
 */
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
                                                                   open,
                                                                   onClose,
                                                                   onConfirm,
                                                                   title,
                                                                   content,
                                                               }) => {
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition} // 使用自定义的过渡效果
            keepMounted
            onClose={onClose}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
        >
            {/* 弹窗标题 */}
            <DialogTitle id="confirmation-dialog-title">
                {title}
            </DialogTitle>

            {/* 弹窗内容 */}
            <DialogContent>
                <DialogContentText id="confirmation-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>

            {/* 弹窗操作按钮 */}
            <DialogActions sx={{ padding: '16px 24px' }}>
                <Button onClick={onClose}>
                    取消
                </Button>
                {/* 点击确认按钮时，先关闭弹窗，再执行确认回调 */}
                <Button
                    onClick={() => {
                        onClose();
                        onConfirm();
                    }}
                    variant="contained"
                    color="error"
                    autoFocus
                >
                    确认删除
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
