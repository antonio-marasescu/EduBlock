import {Component, OnInit} from '@angular/core';
import {ActionBarInputModel} from '../../../../core/models/actions/action-bar-input.model';
import {ActionBarType} from '../../../../core/models/actions/action-bar-type.enum';
import {NetworkMemberModel} from '../../../../core/models/network/network-member.model';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {GetNetworkMembers, LearnNetworkMembers} from '../../../../store/actions/network-members.actions';
import {
  selectNetworkMembers,
  selectNetworkMembersStateIsLoading
} from '../../../../store/reducers/network-members.reducer';

export enum NetworkMembersActionTypes {
  Add = 'add',
  Refresh = 'refresh'
}

@Component({
  selector: 'app-smart-network-members',
  templateUrl: './smart-network-members.component.html',
  styleUrls: ['./smart-network-members.component.scss']
})
export class SmartNetworkMembersComponent implements OnInit {
  isLoading$: Observable<boolean>;
  networkMembers$: Observable<NetworkMemberModel[]>;
  actions: ActionBarInputModel[] = [
    {eventName: NetworkMembersActionTypes.Add, type: ActionBarType.ACCENT, displayContent: 'Add Member'},
    {eventName: NetworkMembersActionTypes.Refresh, type: ActionBarType.ACCENT, displayContent: 'Refresh'},
  ];

  constructor(private router: Router, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(selectNetworkMembersStateIsLoading);
    this.networkMembers$ = this.store.select(selectNetworkMembers);
    this.store.dispatch(new GetNetworkMembers());
  }

  async onAction(eventName: string) {
    switch (eventName) {
      case NetworkMembersActionTypes.Add:
        await this.router.navigateByUrl('network/add');
        break;
      case NetworkMembersActionTypes.Refresh:
        this.store.dispatch(new LearnNetworkMembers());
        break;
      default:
        return;
    }
  }


}
