import {Component, Input} from '@angular/core';
import {NetworkMemberModel} from '../../../../core/models/network/network-member.model';

@Component({
  selector: 'app-network-members-list',
  templateUrl: './network-members-list.component.html',
  styleUrls: ['./network-members-list.component.scss']
})
export class NetworkMembersListComponent {
  @Input() members: NetworkMemberModel[];
  displayedColumns: string[] = ['id', 'legalIdentity', 'publicKey', 'promoterLegalIdentity', 'promoterPublicKey', 'joinedDate'];
  displayedColumnsTitleFormat: { [key: string]: string } = {
    id: 'ID',
    legalIdentity: 'Legal Identity',
    publicKey: 'PK',
    promoterLegalIdentity: 'Promoter',
    promoterPublicKey: 'Promoter PK',
    joinedDate: 'Joined Date'
  };
}
