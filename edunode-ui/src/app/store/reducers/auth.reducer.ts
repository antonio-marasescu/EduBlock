import {UserDetailsModel} from '../../core/models/users/user-details.model';
import {AuthActions, AuthActionsTypes} from '../actions/auth.actions';
import {AppState} from '../app.state';
import {createSelector} from '@ngrx/store';

export interface AuthState {
  authUser: UserDetailsModel;
  isLoading: boolean;
}

export const initialAuthState: AuthState = {
  authUser: null,
  isLoading: false,
};

export function authReducer(state: AuthState = initialAuthState, action: AuthActions) {
  switch (action.type) {
    case AuthActionsTypes.GetCurrentUser:
      return {
        ...state,
        authUser: null,
        isLoading: true
      };
    case AuthActionsTypes.GetCurrentUserSuccess:
      return {
        ...state,
        authUser: action.payload,
        isLoading: false
      };
    case AuthActionsTypes.LogoutUser:
      return {
        ...state,
        authUser: null,
        isLoading: false
      };
    default:
      return state;
  }
}

const selectAuthState = (state: AppState) => state.auth;
export const selectAuthUser = createSelector(selectAuthState,
  (state: AuthState) => state.authUser);
export const selectAuthStateIsLoading = createSelector(selectAuthState,
  (state: AuthState) => state.isLoading);
