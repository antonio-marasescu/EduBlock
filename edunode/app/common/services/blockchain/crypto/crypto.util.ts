import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import * as crypto from 'crypto';

export function SHA256(data: any): Buffer {
    return crypto.createHash('sha256').update(data).digest();
}

export function Base64SHA256(data: any): string {
    return Base64.stringify(sha256(data));
}

export function BufferFromBase64(data: string): Buffer {
    return Buffer.from(data, 'base64');
}
