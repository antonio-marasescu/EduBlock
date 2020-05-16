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

  trimFileName(attachment: string): string {
    const fileName = this.attachmentsDetails[attachment] ? this.attachmentsDetails[attachment].filename : attachment;
    const splitFilename = fileName.split('.');
    if (fileName.length < 12) {
      return fileName;
    }
    const extension = splitFilename[1] || '';
    return splitFilename[0].substr(0, 12) + '...' + extension;
  }
}
