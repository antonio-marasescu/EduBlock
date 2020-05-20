import {EduRecordModel} from '../../core/models/records/edu-record.model';
import {RecordsActions, RecordsActionsTypes} from '../actions/records.actions';
import {AppState} from '../app.state';
import {createSelector} from '@ngrx/store';

export interface RecordsState {
  records: EduRecordModel[];
  currentRecord: EduRecordModel;
  isLoading: boolean;
}

export const initialRecordState: RecordsState = {
  records: [],
  currentRecord: null,
  isLoading: false
};

export function recordsReducer(state: RecordsState = initialRecordState, action: RecordsActions) {
  switch (action.type) {
    case RecordsActionsTypes.CreateBlock:
      return {
        ...state,
        isLoading: true
      };
    case RecordsActionsTypes.CreateBlockSuccess:
      return {
        ...state,
        isLoading: false
      };
    case RecordsActionsTypes.GetRecordsTransaction:
      return {
        ...state,
        isLoading: true
      };
    case RecordsActionsTypes.GetRecordsTransactionSuccess:
      return {
        ...state,
        isLoading: false,
        records: action.payload
      };
    case RecordsActionsTypes.GetRecordTransactionByHash:
      return {
        ...state,
        currentRecord: null,
        isLoading: true
      };
    case RecordsActionsTypes.GetRecordTransactionByHashSuccess:
      return {
        ...state,
        isLoading: false,
        currentRecord: action.payload
      };
    case RecordsActionsTypes.CreateRecordTransaction:
      return {
        ...state,
        isLoading: true
      };
    case RecordsActionsTypes.CreateRecordTransactionSuccess:
      return {
        ...state,
        isLoading: false,
        records: state.records.concat([action.payload])
      };
    case RecordsActionsTypes.StopLoading:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}

const selectRecordsState = (state: AppState) => state.records;
export const selectRecords = createSelector(selectRecordsState,
  (state: RecordsState) => state.records);
export const selectCurrentRecord = createSelector(selectRecordsState,
  (state: RecordsState) => state.currentRecord);
export const selectRecordsStateIsLoading = createSelector(selectRecordsState,
  (state: RecordsState) => state.isLoading);
