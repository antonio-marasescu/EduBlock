import {Component, Input} from '@angular/core';
import {NetworkMemberModel} from '../../../../core/models/network/network-member.model';
import {trimString} from '../../../../core/utils/display.string';

@Component({
  selector: 'app-network-members-list',
  templateUrl: './network-members-list.component.html',
  styleUrls: ['./network-members-list.component.scss']
})
export class NetworkMembersListComponent {
  @Input() members: NetworkMemberModel[];
  nonActionColumns: string[] = ['id', 'legalIdentity', 'publicKey', 'promoterLegalIdentity', 'promoterPublicKey', 'joinedDate'];
  displayedColumns = this.nonActionColumns.concat(['actions']);
  displayedColumnsTitleFormat: { [key: string]: string } = {
    id: 'ID',
    legalIdentity: 'Legal Identity',
    publicKey: 'PK',
    promoterLegalIdentity: 'Promoter',
    promoterPublicKey: 'Promoter PK',
    joinedDate: 'Joined Date'
  };

  trimData = (value: string) => trimString(value);
}
