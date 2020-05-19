import {Action} from '@ngrx/store';
import {EduStudentModel} from '../../core/models/students/edu-student.model';

export enum StudentsActionsTypes {
  GetStudents = '[Students] Get Students',
  GetStudentsSuccess = '[Students] Get Students Success',
  AddStudent = '[Students] Add Student',
  AddStudentSuccess = '[Students] Add Student Success',
}

export class GetStudents implements Action {
  public readonly type = StudentsActionsTypes.GetStudents;
}

export class GetStudentsSuccess implements Action {
  public readonly type = StudentsActionsTypes.GetStudentsSuccess;

  constructor(public payload: EduStudentModel[]) {
  }
}

export class AddStudent implements Action {
  public readonly type = StudentsActionsTypes.AddStudent;

  constructor(public payload: EduStudentModel) {
  }
}

export class AddStudentSuccess implements Action {
  public readonly type = StudentsActionsTypes.AddStudentSuccess;

  constructor(public payload: EduStudentModel) {
  }
}

export type StudentsActions = GetStudents | GetStudentsSuccess | AddStudent | AddStudentSuccess;
