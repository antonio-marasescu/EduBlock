import {NetworkMemberModel} from '../../core/models/network/network-member.model';
import {NetworkMembersActions, NetworkMembersActionsTypes} from '../actions/network-members.actions';
import {AppState} from '../app.state';
import {createSelector} from '@ngrx/store';
import {PersonalIdentityModel} from '../../core/models/network/personal-identity.model';

export interface NetworkMembersState {
  networkMembers: NetworkMemberModel[];
  personalIdentity: PersonalIdentityModel;
  isLoading: boolean;
}

export const initialNetworkMembersState: NetworkMembersState = {
  networkMembers: [],
  personalIdentity: null,
  isLoading: false
};

export function networkMembersReducer(state: NetworkMembersState = initialNetworkMembersState, action: NetworkMembersActions) {
  switch (action.type) {
    case NetworkMembersActionsTypes.GetNetworkMembers:
      return {
        ...state,
        isLoading: true
      };
    case NetworkMembersActionsTypes.GetNetworkMembersSuccess:
      return {
        ...state,
        networkMembers: action.payload,
        isLoading: false
      };
    case NetworkMembersActionsTypes.LearnNetworkMembers:
      return {
        ...state,
        isLoading: true
      };
    case NetworkMembersActionsTypes.LearnNetworkMembersSuccess:
      return {
        ...state,
        networkMembers: action.payload,
        isLoading: false
      };
    case NetworkMembersActionsTypes.AddNetworkMember:
      return {
        ...state,
        isLoading: true
      };
    case NetworkMembersActionsTypes.AddNetworkMemberSuccess:
      return {
        ...state,
        networkMembers: state.networkMembers.concat([action.payload]),
        isLoading: false
      };
    case NetworkMembersActionsTypes.GetNetworkPersonalIdentitySuccess:
      return {
        ...state,
        personalIdentity: action.payload
      };
    case NetworkMembersActionsTypes.StopLoading:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}


const selectNetworkMembersState = (state: AppState) => state.networkMembers;
export const selectNetworkMembers = createSelector(selectNetworkMembersState,
  (state: NetworkMembersState) => state.networkMembers);
export const selectNetworkPersonalIdentity = createSelector(selectNetworkMembersState,
  (state: NetworkMembersState) => state.personalIdentity);
export const selectNetworkMembersStateIsLoading = createSelector(selectNetworkMembersState,
  (state: NetworkMembersState) => state.isLoading);
