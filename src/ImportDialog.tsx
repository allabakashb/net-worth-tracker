import React, {useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const ImportDialog: React.FC<any> = ({ onClose }) => {
    const [investData, setInvestData] = useState('');
    const [apiData, setApiData] = useState('');

    const importData = () => {
        if (investData) {
            localStorage.setItem('investKey', investData);
        }
        if (apiData) {
            localStorage.setItem('apiConfig', apiData);
        }
        onClose();
    }

    return <Dialog maxWidth={'md'} open>
        <DialogContent sx={{ minWidth: 200, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <TextField variant={'outlined'}
                       value={investData}
                       onChange={(event) => setInvestData(event.target.value)} />
            <TextField variant={'outlined'}
                       value={apiData}
                       onChange={(event) => setApiData(event.target.value)} />
            <Button variant={'contained'} onClick={importData} disabled={!investData && !apiData}>Import</Button>
            <Button variant={'contained'} onClick={onClose}>Close</Button>
        </DialogContent>
    </Dialog>;
}

export default ImportDialog;