import React, {useCallback, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { InputLabel } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const AddDialog: React.FC<any> = ({ onClose, existingData }) => {
    const types = [
    {
        name: 'RSU',
        fields: [
            {name: 'Name', type: 'text'},
            {name: 'Current Units', type: 'number'},
            {name: 'currentPrice', type: 'number', optional: true},
        ]
    },
    {
        name: 'EQUITY',
        fields: [
            {name: 'Name', type: 'text'},
            {name: 'Current Units', type: 'number'},
            {name: 'currentPrice', type: 'number', optional: true},
        ]
    },
    {
        name: 'MUTUAL FUNDS',
        fields: [
            {name: 'Name', type: 'text'},
            {name: 'Current Units', type: 'number'},
            {name: 'currentPrice', type: 'number', optional: true},
        ]
    },
    {
        name: 'RD',
        fields: [
            {name: 'Name', type: 'text'},
            {name: 'Amount', type: 'number'},
            {name: 'Monthly Amount', type: 'number'},
            {name: 'Expiry', type: 'date'},
            {name: 'RD Monthly Date', type: 'text'},
        ]
    },
    {
        name: 'FD',
        fields: [
            {name: 'Name', type: 'text'},
            {name: 'Amount', type: 'number'},
            {name: 'Expiry', type: 'date'},
        ]
    },
    {
        name: 'Savings',
        fields: [
            {name: 'Name', type: 'text'},
            {name: 'Amount', type: 'number'},
        ]
    }];

    const getCurrentType = () => {
        if (!existingData) return types[0];
        return types.filter(item => item.name === existingData.type)[0];
    }

    const [current, setCurrent] = useState<any>(getCurrentType());

    const resetNewObj = useCallback((selected: any) => {
        const newObj = { type: selected.name, lastUpdated: new Date().getTime() };
        for (let field of selected.fields) {
            // @ts-ignore
            newObj[field.name] = '';
        }
        return newObj;
    }, []);

    const getCurrValue = () => {
        if (!existingData) return resetNewObj(types[0]);
        return existingData;
    }

    const [value, setValue] = useState<any>(getCurrValue());
    const onTypeChange = (selected: any) => {
        setCurrent(selected);
        setValue(resetNewObj(selected));
    }

    const onInputChange = (event: any, field: string) => {
        setValue({ ...value, [field]: event.target.value, lastUpdated: new Date().getTime() });
    }

    const isDisabled = () => {
        for (let field of current.fields) {
            if (!value[field.name] && !field.optional) return true;
        }
        return false;
    }
    return <Dialog maxWidth={'sm'} fullScreen onClose={onClose} open>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <FormControl sx={{ m: 1, minWidth: 290 }} variant="standard">
                <InputLabel id="type-label" sx={{ padding: '5px' }}>Investment Type</InputLabel>
            <Select id={'type'} variant={'outlined'}
                    labelId={'type-label'}
                    value={current.name} size={'medium'} disabled={existingData !== undefined}>
                {types.map(type =>
                               <MenuItem key={type.name} value={type.name} onClick={() => onTypeChange(type)}>
                                   {type.name}
                               </MenuItem>)}
            </Select>
            </FormControl>
            {
                current.fields.map((field: any) =>
                                       <FormControl key={field.name} sx={{ m: 1, minWidth: 290 }} variant="standard">
                    <TextField id={field.name}
                               placeholder={`Enter ${field.name}`}
                               value={value[field.name]}
                               type={field.type as any}
                               onChange={(event) =>
                                   onInputChange(event, field.name)}/>
                </FormControl>)
            }
            <Box sx={{ m: 1, minWidth: 290, display: 'flex', gap: '20px' }}>
                <Button variant={'contained'} disabled={isDisabled()} onClick={() => onClose(value)}>Add</Button>
                <Button variant={'outlined'} onClick={() => onClose()}>Cancel</Button>
            </Box>
        </DialogContent>
    </Dialog>
}

export default AddDialog;