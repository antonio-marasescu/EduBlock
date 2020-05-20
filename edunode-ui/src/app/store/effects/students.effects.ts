import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {SetError} from '../actions/http-errors.actions';
import {StudentsService} from '../../core/services/students.service';
import {
  AddStudent,
  AddStudentSuccess,
  GetStudents,
  GetStudentsSuccess,
  StopLoading,
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
  getStudents$ = this.actions$.pipe(
    ofType<GetStudents>(StudentsActionsTypes.GetStudents),
    switchMap(() => this.studentsService.getStudents().pipe(
      map(students => new GetStudentsSuccess(students)),
      catchError(error => [new SetError(error), new StopLoading()])
    ))
  );

  @Effect()
  createStudent$ = this.actions$.pipe(
    ofType<AddStudent>(StudentsActionsTypes.AddStudent),
    map(action => action.payload),
    switchMap(newStudent => this.studentsService.addStudent(newStudent).pipe(
      map(addedStudent => new AddStudentSuccess(addedStudent)),
      catchError(error => [new SetError(error), new StopLoading()])
    ))
  );

  @Effect({dispatch: false})
  createStudentSuccess$ = this.actions$.pipe(
    ofType<AddStudentSuccess>(StudentsActionsTypes.AddStudentSuccess),
    tap(() => this.router.navigateByUrl('/students'))
  );
}
