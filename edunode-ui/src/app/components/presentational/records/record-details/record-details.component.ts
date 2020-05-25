import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EduRecordModel} from '../../../../core/models/records/edu-record.model';
import {EduRecordAttachmentModel} from '../../../../core/models/records/edu-record-attachment.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-record-details',
  templateUrl: './record-details.component.html',
  styleUrls: ['./record-details.component.scss']
})
export class RecordDetailsComponent {
  @Input() record: EduRecordModel;
  @Input() attachmentsDetails: EduRecordAttachmentModel[];
  @Output() download: EventEmitter<EduRecordAttachmentModel> = new EventEmitter<EduRecordAttachmentModel>();

  constructor(private snackBar: MatSnackBar) {
  }

  showExportMessage() {
    this.snackBar.open('The information has been copied to the clipboard', 'Ok', {duration: 2000});
  }

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
