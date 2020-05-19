import {EduStudentModel} from '../../core/models/students/edu-student.model';
import {StudentsActions, StudentsActionsTypes} from '../actions/students.actions';

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
    default:
      return state;
  }

}
