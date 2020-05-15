import {Component} from '@angular/core';
import {ActionBarInputModel} from '../../../../core/models/actions/action-bar-input.model';
import {ActionBarType} from '../../../../core/models/actions/action-bar-type.enum';
import {Router} from '@angular/router';

export enum RecordsListActionTypes {
  CREATE_TRANSACTION = 'create-transaction',
  CREATE_BLOCK = 'create-block'
}


@Component({
  selector: 'app-smart-records-list',
  templateUrl: './smart-records-list.component.html',
  styleUrls: ['./smart-records-list.component.scss']
})
export class SmartRecordsListComponent {
  actions: ActionBarInputModel[] = [
    {
      eventName: RecordsListActionTypes.CREATE_TRANSACTION,
      type: ActionBarType.ACCENT,
      displayContent: 'Create Record'
    },
    {eventName: RecordsListActionTypes.CREATE_BLOCK, type: ActionBarType.ACCENT, displayContent: 'Create Block'},
  ];

  constructor(private router: Router) {
  }

  async onAction(eventName: string) {
    switch (eventName) {
      case RecordsListActionTypes.CREATE_TRANSACTION:
        await this.router.navigateByUrl('/records/create');
        break;
      case RecordsListActionTypes.CREATE_BLOCK:
        break;
    }
  }
}
