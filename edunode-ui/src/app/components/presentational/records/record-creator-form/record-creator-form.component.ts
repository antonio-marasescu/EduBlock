import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {EduStudentModel} from '../../../../core/models/students/edu-student.model';
import {NgxFileDropEntry} from 'ngx-file-drop';


@Component({
  selector: 'app-record-creator-form',
  templateUrl: './record-creator-form.component.html',
  styleUrls: ['./record-creator-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordCreatorFormComponent {
  @Input() form: FormGroup;
  @Input() availableStudents: EduStudentModel[] = [];
  @Input() attachments: File[] = [];
  @Output() addedFile: EventEmitter<NgxFileDropEntry[]> = new EventEmitter<NgxFileDropEntry[]>();
  @Output() removeFile: EventEmitter<File> = new EventEmitter<File>();

  display(studentModel: EduStudentModel): string {
    if (!studentModel) {
      return '';
    }
    return studentModel.groupId + ' ' + studentModel.fullName + ' ' + studentModel.publicKey;
  }

  trimFileName(fileName: string): string {
    if (fileName.length < 12) {
      return fileName;
    }
    const splitFilename = fileName.split('.');
    return splitFilename[0].substr(0, 12) + '...' + splitFilename[1];
  }
}
