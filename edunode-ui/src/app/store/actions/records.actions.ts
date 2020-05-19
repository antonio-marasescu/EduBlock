import {Action} from '@ngrx/store';
import {EduRecordModel} from '../../core/models/records/edu-record.model';
import {CreateEduRecordModel} from '../../core/models/records/create-edu-record.model';

export enum RecordsActionsTypes {
  GetRecordsTransaction = '[Records-Transactions] Get Records Transactions',
  GetRecordsTransactionSuccess = '[Records-Transactions] Get Records Transactions Success',
  GetRecordTransactionByHash = '[Records-Transactions] Get Record Transaction By Hash',
  GetRecordTransactionByHashSuccess = '[Records-Transactions] Get Record Transaction By Hash Success',
  CreateRecordTransaction = '[Records-Transactions] Create Transaction',
  CreateRecordTransactionSuccess = '[Records-Transactions] Create Transaction Success',
  CreateBlock = '[Records-Transactions] Create Block',
  CreateBlockSuccess = '[Records-Transactions] Create Block Success',
}

export class GetRecordsTransaction implements Action {
  public readonly type = RecordsActionsTypes.GetRecordsTransaction;
}

export class GetRecordsTransactionSuccess implements Action {
  public readonly type = RecordsActionsTypes.GetRecordsTransactionSuccess;

  constructor(public payload: EduRecordModel[]) {
  }
}

export class GetRecordTransactionByHash implements Action {
  public readonly type = RecordsActionsTypes.GetRecordTransactionByHash;

  constructor(public payload: string) {
  }
}

export class GetRecordTransactionByHashSuccess implements Action {
  public readonly type = RecordsActionsTypes.GetRecordTransactionByHashSuccess;

  constructor(public payload: EduRecordModel) {
  }
}

export class CreateRecordTransaction implements Action {
  public readonly type = RecordsActionsTypes.CreateRecordTransaction;

  constructor(public payload: CreateEduRecordModel) {
  }
}

export class CreateRecordTransactionSuccess implements Action {
  public readonly type = RecordsActionsTypes.CreateRecordTransactionSuccess;

  constructor(public payload: EduRecordModel) {
  }
}

export class CreateBlock implements Action {
  public readonly type = RecordsActionsTypes.CreateBlock;
}

export class CreateBlockSuccess implements Action {
  public readonly type = RecordsActionsTypes.CreateBlockSuccess;

  constructor(public payload: number) {
  }
}

export type RecordsActions =
  GetRecordsTransaction
  | GetRecordsTransactionSuccess
  | GetRecordTransactionByHash
  | GetRecordTransactionByHashSuccess
  | CreateRecordTransaction
  | CreateRecordTransactionSuccess
  | CreateBlock
  | CreateBlockSuccess;
