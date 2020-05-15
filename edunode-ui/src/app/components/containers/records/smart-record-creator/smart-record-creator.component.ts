import {Component} from '@angular/core';
import {ActionBarInputModel} from '../../../../core/models/actions/action-bar-input.model';
import {ActionBarType} from '../../../../core/models/actions/action-bar-type.enum';
import {Router} from '@angular/router';

export enum RecordCreatorActionTypes {
  CREATE = 'create',
  EXIT = 'exit'
}


@Component({
  selector: 'app-smart-record-creator',
  templateUrl: './smart-record-creator.component.html',
  styleUrls: ['./smart-record-creator.component.scss']
})
export class SmartRecordCreatorComponent {
  actions: ActionBarInputModel[] = [
    {eventName: RecordCreatorActionTypes.EXIT, type: ActionBarType.STANDARD, displayContent: 'Close'},
    {eventName: RecordCreatorActionTypes.CREATE, type: ActionBarType.ACCENT, displayContent: 'Create Record'},
  ];

  constructor(private router: Router) {
  }

  async onAction(eventName: string) {
    switch (eventName) {
      case RecordCreatorActionTypes.EXIT:
        await this.router.navigateByUrl('/records');
        break;
      case RecordCreatorActionTypes.CREATE:
        break;
    }
  }
}
