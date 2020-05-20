export class EduRecordAttachmentModel {
  hash: string;
  version: number;
  ownerPublicKey: string;
  filename: string;
  mimeType: string;
  encoding: string;
  content: Buffer;
  size: number;
}
