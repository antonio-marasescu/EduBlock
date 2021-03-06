import {Action} from '@ngrx/store';
import {NetworkMemberModel} from '../../core/models/network/network-member.model';
import {AddNetworkMemberModel} from '../../core/models/network/add-network-member.model';
import {PersonalIdentityModel} from '../../core/models/network/personal-identity.model';

export enum NetworkMembersActionsTypes {
  GetNetworkMembers = '[Network-Members] Get Network Members',
  GetNetworkMembersSuccess = '[Network-Members] Get Network Members Success',
  LearnNetworkMembers = '[Network-Members] Learn Network Members',
  LearnNetworkMembersSuccess = '[Network-Members] Learn Network Members Success',
  AddNetworkMember = '[Network-Members] Add Network Member',
  AddNetworkMemberSuccess = '[Network-Members] Add Network Member Success',
  GetNetworkPersonalIdentity = '[Network-Members] Get Personal Identity',
  GetNetworkPersonalIdentitySuccess = '[Network-Members] Get Personal Identity Success',
  StopLoading = '[Network-Members] Stop Loading'
}

export class GetNetworkPersonalIdentity implements Action {
  public readonly type = NetworkMembersActionsTypes.GetNetworkPersonalIdentity;
}

export class GetNetworkPersonalIdentitySuccess implements Action {
  public readonly type = NetworkMembersActionsTypes.GetNetworkPersonalIdentitySuccess;

  constructor(public payload: PersonalIdentityModel) {
  }
}


export class GetNetworkMembers implements Action {
  public readonly type = NetworkMembersActionsTypes.GetNetworkMembers;
}

export class GetNetworkMembersSuccess implements Action {
  public readonly type = NetworkMembersActionsTypes.GetNetworkMembersSuccess;

  constructor(public payload: NetworkMemberModel[]) {
  }
}

export class LearnNetworkMembers implements Action {
  public readonly type = NetworkMembersActionsTypes.LearnNetworkMembers;
}

export class LearnNetworkMembersSuccess implements Action {
  public readonly type = NetworkMembersActionsTypes.LearnNetworkMembersSuccess;

  constructor(public payload: NetworkMemberModel[]) {
  }
}

export class AddNetworkMember implements Action {
  public readonly type = NetworkMembersActionsTypes.AddNetworkMember;

  constructor(public payload: AddNetworkMemberModel) {
  }
}

export class AddNetworkMemberSuccess implements Action {
  public readonly type = NetworkMembersActionsTypes.AddNetworkMemberSuccess;

  constructor(public payload: NetworkMemberModel) {
  }
}

export class StopLoading implements Action {
  public readonly type = NetworkMembersActionsTypes.StopLoading;
}

export type NetworkMembersActions =
  GetNetworkMembers
  | GetNetworkMembersSuccess
  | LearnNetworkMembers
  | LearnNetworkMembersSuccess
  | AddNetworkMember
  | AddNetworkMemberSuccess
  | GetNetworkPersonalIdentity
  | GetNetworkPersonalIdentitySuccess
  | StopLoading;
