import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {catchError, map, switchMap} from 'rxjs/operators';
import {SetError} from '../actions/http-errors.actions';
import {of} from 'rxjs';
import {StudentsService} from '../../core/services/students.service';
import {
  AddStudent,
  AddStudentSuccess,
  GetStudents,
  GetStudentsSuccess,
  StudentsActionsTypes
} from '../actions/students.actions';

@Injectable()
export class StudentsEffects {
  constructor(
    private studentsService: StudentsService,
    private actions$: Actions,
    private router: Router
  ) {
  }

  @Effect()
  getRecordsTransaction$ = this.actions$.pipe(
    ofType<GetStudents>(StudentsActionsTypes.GetStudents),
    switchMap(() => this.studentsService.getStudents().pipe(
      map(students => new GetStudentsSuccess(students)),
      catchError(error => of(new SetError(error)))
    ))
  );

  @Effect()
  createRecordTransaction$ = this.actions$.pipe(
    ofType<AddStudent>(StudentsActionsTypes.AddStudent),
    map(action => action.payload),
    switchMap(newStudent => this.studentsService.addStudent(newStudent).pipe(
      map(addedStudent => new AddStudentSuccess(addedStudent)),
      catchError(error => of(new SetError(error)))
    ))
  );
}
