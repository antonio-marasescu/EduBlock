import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {catchError, map, switchMap} from 'rxjs/operators';
import {SetError} from '../actions/http-errors.actions';
import {FilesService} from '../../core/services/files.service';
import {
  FilesActionsTypes,
  GetFilesOfTransactionByHash,
  GetFilesOfTransactionByHashSuccess,
  StopLoading,
  UploadFile,
  UploadFileSuccess
} from '../actions/files.actions';

@Injectable()
export class FilesEffects {
  constructor(
    private filesService: FilesService,
    private actions$: Actions,
    private router: Router
  ) {
  }

  @Effect()
  getFilesForTransaction$ = this.actions$.pipe(
    ofType<GetFilesOfTransactionByHash>(FilesActionsTypes.GetFilesOfTransactionByHash),
    map(action => action.payload),
    switchMap(transactionHashId => this.filesService.getFilesForTransaction(transactionHashId).pipe(
      map(files => new GetFilesOfTransactionByHashSuccess(files)),
      catchError(error => [new SetError(error), new StopLoading()])
    ))
  );


  @Effect()
  uploadFile = this.actions$.pipe(
    ofType<UploadFile>(FilesActionsTypes.UploadFile),
    map(action => action.payload),
    switchMap(file => this.filesService.uploadFile(file).pipe(
      map(savedFile => new UploadFileSuccess(savedFile)),
      catchError(error => [new SetError(error), new StopLoading()])
    ))
  )
}
