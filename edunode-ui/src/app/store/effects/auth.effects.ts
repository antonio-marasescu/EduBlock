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
  LoginUser,
  LoginUserSuccess,
  LogoutUser
} from '../actions/auth.actions';
import {SetError} from '../actions/http-errors.actions';

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
    tap(() => this.router.navigateByUrl('/home')),
    switchMap(() => of(new GetCurrentUser(false)))
  );

  @Effect()
  getCurrentUser$ = this.actions$.pipe(
    ofType<GetCurrentUser>(AuthActionsTypes.GetCurrentUser),
    map(action => action.payload),
    switchMap(willRefresh => this.authService.getMe().pipe(
      map(user => new GetCurrentUserSuccess(user)),
      catchError(error => of(new SetError(error)))
    ))
  );


  @Effect({dispatch: false})
  logoutUser$ = this.actions$.pipe(
    ofType<LogoutUser>(AuthActionsTypes.LogoutUser),
    tap(() => this.authService.logout().subscribe(() => this.router.navigateByUrl('/login')
    ))
  );
}
