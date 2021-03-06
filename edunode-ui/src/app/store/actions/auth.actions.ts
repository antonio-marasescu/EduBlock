import {Action} from '@ngrx/store';
import {UserCredentialsModel} from '../../core/models/users/user-credentials.model';
import {UserDetailsModel} from '../../core/models/users/user-details.model';

export enum AuthActionsTypes {
  GetCurrentUser = '[Auth-User] Get Current',
  GetCurrentUserSuccess = '[Auth-User] Get Current Success',
  LoginUser = '[Auth-User] Login',
  LoginUserSuccess = '[Auth-User] Login Success',
  LoginRedirect = '[Auth-User] Login Redirect',
  LogoutUser = '[Auth-User] Logout',
  RegisterUser = '[Auth-User] Register User',
  RegisterUseSuccess = '[Auth-User] Register User Success'
}

export class RegisterUser implements Action {
  public readonly type = AuthActionsTypes.RegisterUser;

  constructor(public payload: UserCredentialsModel) {
  }
}

export class RegisterUseSuccess implements Action {
  public readonly type = AuthActionsTypes.RegisterUseSuccess;

  constructor(public payload: any) {
  }
}


export class GetCurrentUser implements Action {
  public readonly type = AuthActionsTypes.GetCurrentUser;

  constructor(public payload: boolean) {
  }
}

export class GetCurrentUserSuccess implements Action {
  public readonly type = AuthActionsTypes.GetCurrentUserSuccess;

  constructor(public payload: UserDetailsModel) {
  }
}

export class LoginUser implements Action {
  public readonly type = AuthActionsTypes.LoginUser;

  constructor(public payload: UserCredentialsModel) {
  }
}

export class LoginUserSuccess implements Action {
  public readonly type = AuthActionsTypes.LoginUserSuccess;

  constructor(public payload: any) {
  }
}

export class LoginRedirect implements Action {
  public readonly type = AuthActionsTypes.LoginRedirect;

  constructor(public payload: boolean) {
  }
}

export class LogoutUser implements Action {
  public readonly type = AuthActionsTypes.LogoutUser;
}

export type AuthActions =
  LoginUser
  | LoginUserSuccess
  | LoginRedirect
  | LogoutUser
  | RegisterUser
  | RegisterUseSuccess
  | GetCurrentUserSuccess
  | GetCurrentUser;
