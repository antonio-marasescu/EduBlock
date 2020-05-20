import {AuthState} from './reducers/auth.reducer';
import {HttpErrorsState} from './reducers/http-errors.reducer';
import {NetworkMembersState} from './reducers/network-members.reducer';
import {RecordsState} from './reducers/records.reducer';
import {StudentsState} from './reducers/students.reducer';
import {FilesState} from './reducers/files.reducer';

export interface AppState {
  networkMembers: NetworkMembersState;
  records: RecordsState;
  students: StudentsState;
  files: FilesState;
  auth: AuthState;
  httpErrors: HttpErrorsState;
}
