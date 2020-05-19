import {Action} from '@ngrx/store';
import {EduRecordAttachmentModel} from '../../core/models/records/edu-record-attachment.model';

export enum FilesActionsTypes {
  GetFilesOfTransactionByHash = '[Files] Get Files Of Transaction By Hash',
  GetFilesOfTransactionByHashSuccess = '[Files] Get Files Of Transaction By Hash Success',
  UploadFile = '[Files] Upload File',
  UploadFileSuccess = '[Files] Upload File Success',
  ClearUploadedFiles = '[Files] Clear Uploaded Files',
  StopLoading = '[Files] Stop Loading'
}

export class GetFilesOfTransactionByHash implements Action {
  public readonly type = FilesActionsTypes.GetFilesOfTransactionByHash;

  constructor(public payload: string) {
  }
}

export class GetFilesOfTransactionByHashSuccess implements Action {
  public readonly type = FilesActionsTypes.GetFilesOfTransactionByHashSuccess;

  constructor(public payload: EduRecordAttachmentModel[]) {
  }
}

export class UploadFile implements Action {
  public readonly type = FilesActionsTypes.UploadFile;

  constructor(public payload: File) {
  }
}

export class UploadFileSuccess implements Action {
  public readonly type = FilesActionsTypes.UploadFileSuccess;

  constructor(public payload: EduRecordAttachmentModel) {
  }
}

export class StopLoading implements Action {
  public readonly type = FilesActionsTypes.StopLoading;
}

export class ClearUploadedFiles implements Action {
  public readonly type = FilesActionsTypes.ClearUploadedFiles;
}

export type FilesActions =
  GetFilesOfTransactionByHash
  | GetFilesOfTransactionByHashSuccess
  | UploadFile
  | UploadFileSuccess
  | ClearUploadedFiles
  | StopLoading;
