import CryptoJS from 'crypto-js';

export const get = (key: string, code: string | null) => {
    const encrypted = localStorage.getItem(key);
    if (code !== null && encrypted !== null)
    {
        const bytes = CryptoJS.AES.decrypt(encrypted, code);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return null;
}

export const set = (key: string, value: any, code: string | null) => {
    if (code !== null) {
        localStorage.setItem(key, CryptoJS.AES.encrypt(JSON.stringify(value), code).toString());
    }
}

export const encrypt = (value: any, code: any) => {
    return CryptoJS.AES.encrypt(JSON.stringify(value), code).toString();
}