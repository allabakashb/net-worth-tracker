import React, {useState} from 'react';
import './App.css';
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import AddDialog from "./AddDialog";
import {get, set} from "./utils";
import InvestmentList from "./InvestmentList";
import TextField from "@mui/material/TextField";
import AddApiConfigDialog from "./AddApiConfigDialog";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ImportDialog from "./ImportDialog";
import CopyDialog from "./CopyDialog";

const investKey = 'investKey';
const apiConfigKey = 'apiConfig';
function App() {
  const [open, setOpen] = useState(false);
  const [openC, setOpenC] = useState(false);
  const [dollar, setDollarRate] = useState(83);
  const [code, setCode] = useState<string | null>('');
  const [gotCode, setGotCode] = useState<boolean>(false);
  const [openCopyDialog, setOpenCopyDialog] = useState<boolean>(false);
  const [openImportDialog, setOpenImportDialog] = useState<boolean>(false);

  const onDialogClose = (data: any) => {
      if (data) {
          const investData = get(investKey, code);
          if (!investData) {
              set(investKey, [data], code);
          } else {
              setExisting(investData, data);
          }
      }
      setOpen(false);
  }
  const setExisting = (investData: any, data: any) => {
      for (let i = 0; i < investData.length; i++) {
          if (investData[i].Name === data.Name) {
              investData[i] = data;
              set(investKey, investData, code);
              return;
          }
      }
      set(investKey, [...investData, data], code);
  }

  const calculate = async () => {
      const investData = get(investKey, code);
      const apiConfig = get(apiConfigKey, code);
      for (const item of investData) {
            if (item.type === 'RSU') {
                const apiCon = apiConfig?.filter((apiCon: any) => apiCon.name === item.type)[0];
                if (!apiCon) {
                    return alert('There is no config set for ' + item.type);
                }
                const response = await fetch(apiCon.value.replace('{Name}', item.Name));
                const apiData = await response.json();
                item.currentPrice = apiData.results[0].c;
                item.Amount = item.currentPrice * item['Current Units'] * dollar;
                set(investKey, investData, code);
            } else if (item.type === 'MUTUAL FUNDS') {
                const apiCon = apiConfig?.filter((apiCon: any) => apiCon.name === item.Name)[0];
                if (!apiCon) {
                    return alert('There is no config set for ' + item.Name);
                }
                const response = await fetch(apiCon.value);
                const apiData = await response.json();
                item.currentPrice = apiData.data[0].nav;
                item.Amount = item.currentPrice * item['Current Units'];
                set(investKey, investData, code);
            } else if (item.type === 'EQUITY') {
                const apiCon = apiConfig?.filter((apiCon: any) => apiCon.name === item.Name)[0];
                if (!apiCon) {
                    return alert('There is no config set for ' + item.Name);
                }
                const response = await fetch(apiCon.value);
                const apiData = await response.json();
                item.currentPrice = apiData.data[0].price;
                item.Amount = item.currentPrice * item['Current Units'];
                set(investKey, investData, code);
            }
      }
  }

  const openApiConfig = () => {
      setOpenC(true);
  }

  const closeApiConfig = () => {
      setOpenC(false);
  }

  if (!gotCode) {
      return <Dialog maxWidth={'md'} open>
          <DialogContent sx={{ minWidth: 200, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <TextField variant={'outlined'}
                         value={code}
                         onChange={(event) => setCode(event.target.value)} />
              <Button variant={'contained'} onClick={() => setGotCode(true)} disabled={!code}>Submit</Button>
          </DialogContent>
      </Dialog>;
  }

  return (
      <Box sx={{ display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column',
          padding: '10px', gap: '20px'}}>
         <Box sx={{ display: 'flex', gap: '10px' }}>
             <Button variant={'contained'} size={'medium'}
                     onClick={() => setOpen(true)}>Add</Button>
             {
                 open &&
                 <AddDialog onClose={onDialogClose} />
             }
             <Button variant={'contained'} size={'medium'}
                     onClick={calculate}>Refresh All</Button>
             <Button variant={'contained'} size={'medium'}
                     onClick={openApiConfig}>Api Config</Button>
             {
                 openC &&
                 <AddApiConfigDialog onClose={closeApiConfig} code={code} />
             }
             <Button variant={'contained'} size={'medium'}
                     onClick={() => setOpenImportDialog(true)}>Import</Button>
             {
                 openImportDialog && <ImportDialog onClose={() => setOpenImportDialog(false)}></ImportDialog>
             }
             <Button variant={'contained'} size={'medium'}
                     onClick={() => setOpenCopyDialog(true)}>Copy</Button>
             {
                 openCopyDialog && <CopyDialog onClose={() => setOpenCopyDialog(false)}
                                               code={code} />
             }
         </Box>
          <Divider />
          <TextField variant={'outlined'} value={dollar} onChange={(event: any) => setDollarRate(event.target.value)}></TextField>
          <Divider />
          <Box>
              <InvestmentList code={code} dollarRate={dollar}/>
          </Box>
      </Box>
  );
}

export default App;
