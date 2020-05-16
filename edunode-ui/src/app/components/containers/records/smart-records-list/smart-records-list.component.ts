import {Component} from '@angular/core';
import {ActionBarInputModel} from '../../../../core/models/actions/action-bar-input.model';
import {ActionBarType} from '../../../../core/models/actions/action-bar-type.enum';
import {Router} from '@angular/router';
import {EduRecordModel} from '../../../../core/models/records/edu-record.model';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {EduRecordStatus} from '../../../../core/models/records/edu-record-status.enum';

const mockData: EduRecordModel[] = [
  {
    id: '2qgq24t-awrg-awrgawgr',
    hash: 'q2t444444agrrgwagwagawrg',
    blockHash: 'q2t444444agrrgwagwagawrg',
    title: 'Ion-An2-Notes',
    creationDate: new Date().toDateString(),
    targetPublicKey: 'argawgrwaq244tabawgrrawgaw',
    attachments: ['awrgagwrgrwa', 'rwaggragwargwr'],
    status: EduRecordStatus.Certified
  } as any,
  {
    id: '2qgq24t-awrg-awrgawgr',
    hash: 'q2t444444agrrgwagwagawrg',
    blockHash: 'q2t444444agrrgwagwagawrg',
    title: 'Ion-An2-Notes',
    creationDate: new Date().toDateString(),
    targetPublicKey: '1afwaawfwagwgaw',
    attachments: ['awrgagwrgrwa', 'rwaggragwargwr'],
    status: EduRecordStatus.Certified
  } as any,
  {
    id: '2qgq24t-awrg-awrgawgr',
    hash: 'q2t444444agrrgwagwagawrg',
    blockHash: 'q2t444444agrrgwagwagawrg',
    title: 'Ion-An2-Notes',
    creationDate: new Date().toDateString(),
    targetPublicKey: '3rgawgrwawgbawgrrawgaw',
    attachments: ['awrgagwrgrwa', 'rwaggragwargwr'],
    status: EduRecordStatus.Created
  } as any,
];


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

  records$: Observable<EduRecordModel[]> = of(mockData).pipe(delay(500));
  filteredRecords$: Observable<EduRecordModel[]> = of([]);
  isLoading$: Observable<boolean> = of(false);

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

  onFilterEvent(filteredData: EduRecordModel[]) {
    this.filteredRecords$ = of(filteredData);
  }
}
