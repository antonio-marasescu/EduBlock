import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {NetworkMembersService} from '../../core/services/network-members.service';
import {
  AddNetworkMember,
  AddNetworkMemberSuccess,
  GetNetworkMembers,
  GetNetworkMembersSuccess,
  LearnNetworkMembers,
  LearnNetworkMembersSuccess,
  NetworkMembersActionsTypes,
  StopLoading
} from '../actions/network-members.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {SetError} from '../actions/http-errors.actions';

@Injectable()
export class NetworkMembersEffects {
  constructor(
    private networkMembersService: NetworkMembersService,
    private actions$: Actions,
    private router: Router
  ) {
  }

  @Effect()
  getNetworkMembers$ = this.actions$.pipe(
    ofType<GetNetworkMembers>(NetworkMembersActionsTypes.GetNetworkMembers),
    switchMap(() => this.networkMembersService.getNetworkMembers().pipe(
      map(members => new GetNetworkMembersSuccess(members)),
      catchError(error => [new SetError(error), new StopLoading()])
    ))
  );

  @Effect()
  learnNetworkMembers$ = this.actions$.pipe(
    ofType<LearnNetworkMembers>(NetworkMembersActionsTypes.LearnNetworkMembers),
    switchMap(() => this.networkMembersService.learnNetworkMembers().pipe(
      map(members => new LearnNetworkMembersSuccess(members)),
      catchError(error => [new SetError(error), new StopLoading()])
    ))
  );

  @Effect()
  addNetworkMember$ = this.actions$.pipe(
    ofType<AddNetworkMember>(NetworkMembersActionsTypes.AddNetworkMember),
    map(action => action.payload),
    switchMap(newMember => this.networkMembersService.addNetworkMember(newMember).pipe(
      map(addedMember => new AddNetworkMemberSuccess(addedMember)),
      catchError(error => [new SetError(error), new StopLoading()])
    ))
  );

  @Effect({dispatch: false})
  addNetworkMemberSuccess = this.actions$.pipe(
    ofType<AddNetworkMemberSuccess>(NetworkMembersActionsTypes.AddNetworkMemberSuccess),
    tap(() => this.router.navigateByUrl('/network'))
  );
}

