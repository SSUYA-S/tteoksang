import { MD5 } from 'crypto-js';

export function createMD5(data: string) {
    return MD5(data).toString();
}
