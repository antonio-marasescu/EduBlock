export class NetworkMemberModel {
  id?: number;
  publicKey: string;
  legalIdentity: string;
  host: string;
  port: number;
  joinedDate: Date;
  promoterLegalIdentity?: string;
  promoterSignature?: string;
  promoterPublicKey?: string;
  validatorSignature?: string;
  validatorPublicKey?: string;
}
