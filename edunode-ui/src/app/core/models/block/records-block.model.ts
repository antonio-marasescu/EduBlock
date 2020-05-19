export class RecordsBlockModel {
  hash: string;
  index: number;
  previousHash: string;
  nonce: number;
  timestamp: string;
  creatorPublicKey: string;
  creatorSignature: string;
  transactions: string[];
}
