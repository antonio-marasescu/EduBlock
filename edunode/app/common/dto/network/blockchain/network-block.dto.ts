export class NetworkBlockDto {
    hash: string;
    index: number;
    previousHash: string;
    nonce: number;
    timestamp: number;
    creatorPublicKey: string;
    creatorSignature: string;
}
