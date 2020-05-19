import {AppState} from './app.state';
import {ActionReducerMap} from '@ngrx/store';
import {networkMembersReducer} from './reducers/network-members.reducer';
import {recordsReducer} from './reducers/records.reducer';
import {studentsReducer} from './reducers/students.reducer';
import {authReducer} from './reducers/auth.reducer';
import {httpErrorsReducer} from './reducers/http-errors.reducer';
import {filesReducer} from './reducers/files.reducer';

export const AppReducers: ActionReducerMap<AppState, any> = {
  networkMembers: networkMembersReducer,
  records: recordsReducer,
  students: studentsReducer,
  files: filesReducer,
  auth: authReducer,
  httpErrors: httpErrorsReducer,
};
