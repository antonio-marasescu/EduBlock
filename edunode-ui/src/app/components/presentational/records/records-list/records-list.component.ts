import {Component, Input} from '@angular/core';
import {EduRecordModel} from '../../../../core/models/records/edu-record.model';

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.component.html',
  styleUrls: ['./records-list.component.scss']
})
export class RecordsListComponent {
  @Input() records: EduRecordModel[];
  displayedColumns: string[] = ['id', 'title', 'hash', 'blockHash', 'targetPublicKey', 'creationDate', 'status'];
  displayedColumnsTitleFormat: { [key: string]: string } = {
    id: 'ID',
    title: 'Title',
    hash: 'Hash',
    blockHash: 'Block Hash',
    targetPublicKey: 'Student Public Key',
    creationDate: 'Created At',
    status: 'Status'
  };
}
