import {Component, Input} from '@angular/core';
import {NetworkMemberModel} from '../../../../core/models/network/network-member.model';
import {trimString} from '../../../../core/utils/display.string';
import {MatSnackBar} from '@angular/material/snack-bar';

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

  constructor(private snackBar: MatSnackBar) {
  }

  showExportMessage() {
    this.snackBar.open('The information has been copied to the clipboard', 'Ok', {duration: 2000});
  }

  trimData = (value: string) => trimString(value);
}
