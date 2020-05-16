import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EduRecordModel} from '../../../../core/models/records/edu-record.model';
import {EduRecordAttachmentModel} from '../../../../core/models/records/edu-record-attachment.model';

@Component({
  selector: 'app-record-details',
  templateUrl: './record-details.component.html',
  styleUrls: ['./record-details.component.scss']
})
export class RecordDetailsComponent {
  @Input() record: EduRecordModel;
  @Input() attachmentsDetails: { [key: string]: EduRecordAttachmentModel };
  @Output() download: EventEmitter<string> = new EventEmitter<string>();
}
