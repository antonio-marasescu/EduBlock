import {UserDetailsModel} from '../../core/models/users/user-details.model';
import {AuthActions, AuthActionsTypes} from '../actions/auth.actions';

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
