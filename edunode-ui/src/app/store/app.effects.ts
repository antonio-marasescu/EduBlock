import {AuthEffects} from './effects/auth.effects';
import {HttpErrorsEffects} from './effects/http-errors.effects';
import {NetworkMembersEffects} from './effects/network-members.effects';
import {RecordsEffects} from './effects/records.effects';
import {StudentsEffects} from './effects/students.effects';
import {FilesEffects} from './effects/files.effects';

export const AppEffects = [
  AuthEffects,
  HttpErrorsEffects,
  NetworkMembersEffects,
  RecordsEffects,
  StudentsEffects,
  FilesEffects
];
