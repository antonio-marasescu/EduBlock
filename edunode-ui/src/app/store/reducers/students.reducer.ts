import {EduStudentModel} from '../../core/models/students/edu-student.model';
import {StudentsActions, StudentsActionsTypes} from '../actions/students.actions';
import {createSelector} from '@ngrx/store';
import {AppState} from '../app.state';

export interface StudentsState {
  students: EduStudentModel[];
  isLoading: boolean;
}

export const initialStudentsState: StudentsState = {
  students: [],
  isLoading: false
};

export function studentsReducer(state: StudentsState = initialStudentsState, action: StudentsActions) {
  switch (action.type) {

    case StudentsActionsTypes.GetStudents:
      return {
        ...state,
        isLoading: true
      };
    case StudentsActionsTypes.GetStudentsSuccess:
      return {
        ...state,
        students: action.payload,
        isLoading: false
      };
    case StudentsActionsTypes.AddStudent:
      return {
        ...state,
        isLoading: true
      };
    case StudentsActionsTypes.AddStudentSuccess:
      return {
        ...state,
        isLoading: false,
        students: state.students.concat([action.payload])
      };
    case StudentsActionsTypes.StopLoading:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }

}

const selectStudentsState = (state: AppState) => state.students;

export const selectStudents = createSelector(selectStudentsState,
  (state: StudentsState) => state.students);

export const selectStudentsStateIsLoading = createSelector(selectStudentsState,
  (state: StudentsState) => state.isLoading);
