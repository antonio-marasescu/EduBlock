import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {RecordsService} from '../../core/services/records.service';
import {
  CreateBlock,
  CreateBlockSuccess,
  CreateRecordTransaction,
  CreateRecordTransactionSuccess,
  GetRecordsTransaction,
  GetRecordsTransactionSuccess,
  GetRecordTransactionByHash,
  GetRecordTransactionByHashSuccess,
  RecordsActionsTypes
} from '../actions/records.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {SetError} from '../actions/http-errors.actions';
import {of} from 'rxjs';

@Injectable()
export class RecordsEffects {
  constructor(
    private recordsService: RecordsService,
    private actions$: Actions,
    private router: Router
  ) {
  }

  @Effect()
  getRecordsTransaction$ = this.actions$.pipe(
    ofType<GetRecordsTransaction>(RecordsActionsTypes.GetRecordsTransaction),
    switchMap(() => this.recordsService.getRecordTransactions().pipe(
      map(records => new GetRecordsTransactionSuccess(records)),
      catchError(error => of(new SetError(error)))
    ))
  );

  @Effect()
  getRecordTransactionByHash$ = this.actions$.pipe(
    ofType<GetRecordTransactionByHash>(RecordsActionsTypes.GetRecordTransactionByHash),
    map(action => action.payload),
    switchMap(hash => this.recordsService.getRecordTransactionByHash(hash).pipe(
      map(record => new GetRecordTransactionByHashSuccess(record)),
      catchError(error => of(new SetError(error)))
    ))
  );

  @Effect()
  createRecordTransaction$ = this.actions$.pipe(
    ofType<CreateRecordTransaction>(RecordsActionsTypes.CreateRecordTransaction),
    map(action => action.payload),
    switchMap(newRecord => this.recordsService.createRecordTransaction(newRecord).pipe(
      map(addedRecord => new CreateRecordTransactionSuccess(addedRecord)),
      catchError(error => of(new SetError(error)))
    ))
  );

  @Effect({dispatch: false})
  createRecordTransactionSuccess$ = this.actions$.pipe(
    ofType<CreateRecordTransactionSuccess>(RecordsActionsTypes.CreateRecordTransactionSuccess),
    tap(() => this.router.navigateByUrl('/records'))
  );

  @Effect()
  createBlock$ = this.actions$.pipe(
    ofType<CreateBlock>(RecordsActionsTypes.CreateBlock),
    switchMap(() => this.recordsService.createBlock().pipe(
      map(blockIndex => new CreateBlockSuccess(blockIndex)),
      catchError(error => of(new SetError(error)))
    ))
  );
}
