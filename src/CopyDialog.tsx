import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import {encrypt, get} from "./utils";

const CopyDialog: React.FC<any> = ({ onClose, code }) => {
    const copy = (key: string) => {
        const text = get(key, code);
        navigator.clipboard.writeText(encrypt(text, code));
        onClose();
    }

    return <Dialog maxWidth={'md'} open>
        <DialogContent sx={{ minWidth: 200, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button variant={'contained'} onClick={() => copy('investKey')}>Copy Invest Data</Button>
            <Button variant={'contained'} onClick={() => copy('apiConfig')}>Copy Api Data</Button>
            <Button variant={'contained'} onClick={onClose}>Close</Button>
        </DialogContent>
    </Dialog>;
}

export default CopyDialog;