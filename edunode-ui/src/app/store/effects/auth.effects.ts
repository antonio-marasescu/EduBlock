import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {AuthService} from '../../core/services/auth.service';
import {
  AuthActionsTypes,
  GetCurrentUser,
  GetCurrentUserSuccess,
  LoginRedirect,
  LoginUser,
  LoginUserSuccess,
  LogoutUser,
  RegisterUser,
  RegisterUseSuccess
} from '../actions/auth.actions';
import {SetError} from '../actions/http-errors.actions';
import {GetNetworkPersonalIdentity} from '../actions/network-members.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private authService: AuthService,
    private actions$: Actions,
    private router: Router
  ) {
  }

  @Effect()
  loginUser$ = this.actions$.pipe(
    ofType<LoginUser>(AuthActionsTypes.LoginUser),
    map(action => action.payload),
    switchMap(credential => this.authService.login(credential).pipe(
      map(user => new LoginUserSuccess(user)),
      catchError(error => of(new SetError(error)))
    ))
  );

  @Effect()
  loginUserSuccess$ = this.actions$.pipe(
    ofType<LoginUserSuccess>(AuthActionsTypes.LoginUserSuccess),
    tap(() => this.router.navigateByUrl('/network')),
    switchMap(() => [new GetCurrentUser(false), new GetNetworkPersonalIdentity()])
  );

  @Effect()
  registerUser$ = this.actions$.pipe(
    ofType<RegisterUser>(AuthActionsTypes.RegisterUser),
    map(action => action.payload),
    switchMap(userCredentials => this.authService.register(userCredentials).pipe(
      map(data => new RegisterUseSuccess(data)),
      catchError(error => of(new SetError(error)))
    ))
  );

  @Effect({dispatch: false})
  registerUserSuccess$ = this.actions$.pipe(
    ofType<RegisterUseSuccess>(AuthActionsTypes.RegisterUseSuccess),
    tap(() => this.router.navigateByUrl('/login'))
  );

  @Effect()
  getCurrentUser$ = this.actions$.pipe(
    ofType<GetCurrentUser>(AuthActionsTypes.GetCurrentUser),
    map(action => action.payload),
    switchMap(willRefresh => this.authService.getMe().pipe(
      map(user => new GetCurrentUserSuccess(user)),
      catchError(error => of(new LoginRedirect(willRefresh)))
    ))
  );


  @Effect({dispatch: false})
  logoutUser$ = this.actions$.pipe(
    ofType<LogoutUser>(AuthActionsTypes.LogoutUser),
    tap(() => this.authService.logout().subscribe(() => this.router.navigateByUrl('/login')))
  );


  @Effect({dispatch: false})
  loginRedirect$ = this.actions$.pipe(
    ofType<LoginRedirect>(AuthActionsTypes.LoginRedirect),
    map(action => action.payload),
    tap(willRefresh => {
      if (willRefresh) {
        this.router.navigateByUrl('/login');
      }
    })
  );
}
