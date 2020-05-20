import {Action} from '@ngrx/store';

export enum HttpErrorsActionsTypes {
  SetError = '[Http] Set Error',
  UnsetError = '[Http] Unset Error',
}

export class SetError implements Action {
  public readonly type = HttpErrorsActionsTypes.SetError;

  constructor(public payload: any) {
  }
}

export class UnsetError implements Action {
  public readonly type = HttpErrorsActionsTypes.UnsetError;
}

export type HttpErrorsActions = SetError | UnsetError;
