import React, {useEffect, useMemo, useState} from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import {get, set} from "./utils";
import TableBody from "@mui/material/TableBody";
import { TableRow } from "@mui/material";
import Button from "@mui/material/Button";
import WarningIcon from '@mui/icons-material/Warning';
import Tooltip from "@mui/material/Tooltip";
import AddDialog from "./AddDialog";

const investKey = 'investKey';
const InvestmentList: React.FC<any> = ({ code, dollarRate }) => {

    const format = () => {
        const data = get(investKey, code) || [];
        data.forEach((item: any) => {
            if (item.type === 'RD') {
                const actualDay = new Date().getDay();
                const monthlyDay = new Date(item['RD Monthly Date']).getDay();
                const lastUpdatedDay = new Date(item.lastUpdated).getDay();
                if (actualDay === monthlyDay && lastUpdatedDay !== monthlyDay
                    && !isExpired(item)) {
                    item.lastUpdated = new Date().getTime();
                    item.Amount += item['Monthly Amount'];
                }
            } else if (item['Current Units'] && item.currentPrice) {
                const rate = item.type === 'RSU' ? dollarRate : 1;
                item['Amount'] = item['Current Units'] * item.currentPrice * rate;
            }
        });
        return data;
    }

    const [investData, setInvestData] = useState(format());
    const [open, setOpen] = useState<any>(null);

    useEffect(() => {
        setInterval(() => {
            setInvestData(format());
        }, 1000);
    }, []);

    const remove = (index: any) => {
        investData.splice(index, 1);
        set(investKey, investData, code);
        setInvestData(investData);
    }

    const getNumber = (numb: any) => {
        const newNumb = Number(numb);
        return isNaN(newNumb) ? 0 : newNumb;
    }

    const totalAmount = useMemo(() =>
                                    Math.round(investData.map((item: any) => getNumber(item.Amount) || 0)
                                                   .reduce((current: number, newSum: number) =>
                                                               current + newSum, 0)), [investData]);

    const isExpired = (item: any) => {
        if (!item['Expiry']) return false;
        const currTime = new Date().getTime();
        const expiryDate = new Date(item['Expiry']);
        const expiryTime = expiryDate.getTime();
        return currTime >= expiryTime;
    }

    const getWarning = (item: any) => {
        if (!item['Expiry']) return item?.Name;
        const expiryDate = new Date(item['Expiry']).toLocaleDateString();
        if (isExpired(item)) {
            return <Tooltip title={`Note: This investment got matured on ${expiryDate}`}>
                <span style={{ display: 'flex', alignItems: 'end' }}>
                    <WarningIcon sx={{ color: 'orange' }} />
                    {item?.Name}
                </span>
            </Tooltip>
        }
        return item?.Name;
    }

    const edit = (index: any) => {
        setOpen(investData[index]);
    }

    return <>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    investData?.map((item: any, index: any) => <TableRow key={item?.Name}>
                        <TableCell>{getWarning(item)}</TableCell>
                        <TableCell>{Math.round(item?.Amount || 0)}</TableCell>
                        <TableCell><Button onClick={() => edit(index)}>E</Button><Button onClick={() => remove(index)}>X</Button></TableCell>
                    </TableRow>)
                }
                <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell>{totalAmount}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
        {
            open && <AddDialog onClose={() => setOpen(null)} existingData={open} />
        }
    </>
}

export default InvestmentList;