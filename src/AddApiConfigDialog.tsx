import React, {useMemo, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {get, set} from "./utils";
import Divider from "@mui/material/Divider";

const apiConfigKey = 'apiConfig';
const AddApiDialog: React.FC<any> = ({ onClose, code }) => {

    const dataFromStorage = get(apiConfigKey, code) || [];
    const [current, setCurrent] = useState<any>(dataFromStorage);

    const onChange = (event: any, field: any, index: any) => {
        current[index][field] = event.target.value;
        setCurrent([...current]);
        set(apiConfigKey, current, code);
    }

    const remove = (index: any) => {
        current.splice(index, 1);
        setCurrent([...current]);
        set(apiConfigKey, current, code);
    }

    const add = () => {
        current.push({  name: '', value: '', key: new Date().getTime() });
        setCurrent([...current]);
        set(apiConfigKey, current, code);
    }

    const component = useMemo(() => <>{current.map((item: any, index: any) => <Box key={item.key} sx={{ display: 'flex', flexDirection: 'row', gap: '5px'}}>
        <TextField variant={'outlined'} value={item.name}
                   placeholder={'Key'}
                   onChange={(event) => onChange(event, 'name', index) }></TextField>
        <TextField variant={'outlined'} value={item.value}
                   placeholder={'Value'}
                   onChange={(event) => onChange(event, 'value', index) }></TextField>
        <Button onClick={() => remove(index)}>X</Button>
    </Box>)}</>, [current, onChange, remove]);

    return <Dialog maxWidth={'sm'} fullScreen open>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

            <Box sx={{ m: 1, minWidth: 290, display: 'flex', gap: '20px', flexDirection: 'column' }}>
                {
                    component
                }
            </Box>
            <Button variant={'outlined'} onClick={add}>Add</Button>
            <Divider />
            <Box sx={{ m: 1, minWidth: 290, display: 'flex', gap: '20px' }}>
                <Button variant={'outlined'} type={'reset'} onClick={onClose}>Cancel</Button>
            </Box>
        </DialogContent>
    </Dialog>
}

export default AddApiDialog;