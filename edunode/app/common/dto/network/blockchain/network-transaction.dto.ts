export class NetworkTransactionDto {
    hash: string;
    blockHash: string;
    version: number;
    creatorPublicKey: string;
    creatorSignature: string;
    certificateAuthorityPublicKey: string;
    certificateSignature: string;
    creationDate: string;
    targetPublicKey: string;
    attachments: string[];
}
