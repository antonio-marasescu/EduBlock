import {EduRecordStatus} from './edu-record-status.enum';

export class EduRecordModel {
  id: string;

  hash: string;

  blockHash?: string;

  version: number;

  creatorPublicKey: string;

  creatorSignature: string;

  certificateAuthorityPublicKey: string;

  certificateSignature: string;

  creationDate: string;

  targetPublicKey: string;

  attachments: string[];

  title: string;

  status: EduRecordStatus;
}
