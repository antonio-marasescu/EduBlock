import {FilesActions, FilesActionsTypes} from '../actions/files.actions';
import {AppState} from '../app.state';
import {createSelector} from '@ngrx/store';
import {EduRecordAttachmentModel} from '../../core/models/records/edu-record-attachment.model';

export interface FilesState {
  files: EduRecordAttachmentModel[];
  uploadedFiles: EduRecordAttachmentModel[];
  isLoading: boolean;
  isUploadingFiles: boolean;
}

export const initialFilesState: FilesState = {
  files: [],
  uploadedFiles: [],
  isLoading: false,
  isUploadingFiles: false,
};

export function filesReducer(state: FilesState = initialFilesState, action: FilesActions) {
  switch (action.type) {
    case FilesActionsTypes.GetFilesOfTransactionByHash:
      return {
        ...state,
        isLoading: true
      };
    case FilesActionsTypes.GetFilesOfTransactionByHashSuccess:
      return {
        ...state,
        files: action.payload,
        isLoading: false
      };
    case FilesActionsTypes.StopLoading:
      return {
        ...state,
        isLoading: false,
        isUploadingFiles: false
      };
    case FilesActionsTypes.UploadFile:
      return {
        ...state,
        isUploadingFiles: true
      };
    case FilesActionsTypes.UploadFileSuccess:
      return {
        ...state,
        uploadedFiles: state.uploadedFiles.concat([action.payload]),
        isUploadingFiles: false
      };
    case FilesActionsTypes.ClearUploadedFiles:
      return {
        ...state,
        isUploadingFiles: false,
        uploadedFiles: []
      };
    default:
      return state;
  }
}

const selectFilesState = (state: AppState) => state.files;
export const selectFiles = createSelector(selectFilesState,
  (state: FilesState) => state.files);
export const selectFilesStateIsLoading = createSelector(selectFilesState,
  (state: FilesState) => state.isLoading);
export const selectFilesStateIsUploadingFiles = createSelector(selectFilesState,
  (state: FilesState) => state.isUploadingFiles);
export const selectUploadedFiles = createSelector(selectFilesState,
  (state: FilesState) => state.uploadedFiles);

