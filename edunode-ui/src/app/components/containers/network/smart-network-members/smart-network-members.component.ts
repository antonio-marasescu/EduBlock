import {Component} from '@angular/core';
import {ActionBarInputModel} from '../../../../core/models/actions/action-bar-input.model';
import {ActionBarType} from '../../../../core/models/actions/action-bar-type.enum';
import {NetworkMemberModel} from '../../../../core/models/network/network-member.model';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {Router} from '@angular/router';

const mock: NetworkMemberModel[] = [
  {
    id: 0,
    legalIdentity: 'University of Amsterdam',
    publicKey: '1425aegw24qgg2t432gq2',
    promoterLegalIdentity: 'University of Bucharest',
    promoterPublicKey: '152jggehawu2valawrgrw',
    joinedDate: new Date().toDateString()
  },
  {
    id: 1,
    legalIdentity: 'University of Bucharest',
    publicKey: '1435aegw24qgg2t432gq2',
    promoterLegalIdentity: '',
    promoterPublicKey: '',
    joinedDate: new Date().toDateString()
  },
  {
    id: 2,
    legalIdentity: 'University of Cluj-Napoca',
    publicKey: '1125aegw24qgg2t432gq2',
    promoterLegalIdentity: '',
    promoterPublicKey: '',
    joinedDate: new Date().toDateString()
  }
];

export enum NetworkMembersActionTypes {
  Add = 'add',
  Refresh = 'refresh'
}

@Component({
  selector: 'app-smart-network-members',
  templateUrl: './smart-network-members.component.html',
  styleUrls: ['./smart-network-members.component.scss']
})
export class SmartNetworkMembersComponent {
  isLoading$: Observable<boolean> = of(false);

  constructor(private router: Router) {
  }

  networkMembers$: Observable<NetworkMemberModel[]> = of(mock).pipe(delay(1000));
  actions: ActionBarInputModel[] = [
    {eventName: NetworkMembersActionTypes.Add, type: ActionBarType.ACCENT, displayContent: 'Add Member'},
    {eventName: NetworkMembersActionTypes.Refresh, type: ActionBarType.ACCENT, displayContent: 'Refresh'},
  ];

  async onAction(eventName: string) {
    switch (eventName) {
      case NetworkMembersActionTypes.Add:
        await this.router.navigateByUrl('network/add');
        break;
      case NetworkMembersActionTypes.Refresh:
        break;
      default:
        return;
    }
  }
}
