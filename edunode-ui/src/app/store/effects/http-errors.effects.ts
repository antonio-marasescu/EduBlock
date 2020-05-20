import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {ErrorsService} from '../../core/services/errors.service';
import {delay, map, tap} from 'rxjs/operators';
import {HttpErrorsActionsTypes, SetError, UnsetError} from '../actions/http-errors.actions';

export const ERROR_DISPLAY_TIME = 10000;

@Injectable()
export class HttpErrorsEffects {
  constructor(
    private httpErrorsService: ErrorsService,
    private actions$: Actions,
    private router: Router
  ) {
  }

  @Effect()
  setError$ = this.actions$.pipe(
    ofType<SetError>(HttpErrorsActionsTypes.SetError),
    map(action => action.payload),
    tap(error => this.httpErrorsService.setError(error)),
    delay(ERROR_DISPLAY_TIME),
    map(() => new UnsetError())
  );

  @Effect({dispatch: false})
  unsetError$ = this.actions$.pipe(
    ofType<UnsetError>(HttpErrorsActionsTypes.UnsetError),
    tap(() => this.httpErrorsService.unsetError())
  );

}
