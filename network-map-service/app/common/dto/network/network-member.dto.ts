export class NetworkMemberDto {
    id?: number;

    entityHash?: string;

    version?: number;

    publicKey: string;

    legalIdentity: string;

    host: string;

    port: number;

    joinedDate: string;

    promoterSignature?: string;

    promoterPublicKey?: string;

    validatorSignature?: string;

    validatorPublicKey?: string;
}
