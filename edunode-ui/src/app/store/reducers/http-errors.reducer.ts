import {HttpErrorsActions, HttpErrorsActionsTypes} from '../actions/http-errors.actions';

export interface HttpErrorsState {
  latestError: any;
}

export const initialHttpErrorsState: HttpErrorsState = {latestError: null};

export function httpErrorsReducer(state: HttpErrorsState = initialHttpErrorsState, action: HttpErrorsActions) {
  switch (action.type) {
    case HttpErrorsActionsTypes.SetError:
      return {latestError: action.payload};
    case HttpErrorsActionsTypes.UnsetError:
      return {latestError: null};
    default:
      return state;
  }
}
