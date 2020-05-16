import {Component, OnInit} from '@angular/core';
import {ActionBarInputModel} from '../../../../core/models/actions/action-bar-input.model';
import {ActionBarType} from '../../../../core/models/actions/action-bar-type.enum';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {EduStudentModel} from '../../../../core/models/students/edu-student.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {tap} from 'rxjs/operators';

export enum RecordCreatorActionTypes {
  CREATE = 'create',
  EXIT = 'exit'
}

const mockStudentData: EduStudentModel[] = [{
  publicKey: '42qgq4t4q2t',
  fullName: 'Ion Pasvante',
  groupId: '30441',
  faculty: 'Computer Science'
}];

@Component({
  selector: 'app-smart-record-creator',
  templateUrl: './smart-record-creator.component.html',
  styleUrls: ['./smart-record-creator.component.scss']
})
export class SmartRecordCreatorComponent implements OnInit {

  isLoading$: Observable<boolean> = of(false);
  latestAvailableStudents: EduStudentModel[] = [];
  availableStudents$: Observable<EduStudentModel[]> = of(mockStudentData);
  actions: ActionBarInputModel[] = [
    {eventName: RecordCreatorActionTypes.EXIT, type: ActionBarType.STANDARD, displayContent: 'Close'},
    {eventName: RecordCreatorActionTypes.CREATE, type: ActionBarType.ACCENT, displayContent: 'Create'},
  ];
  form: FormGroup;
  files: File[] = [];

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

  ngOnInit(): void {
    this.form = new FormGroup({
      recordTitle: new FormControl(null, [Validators.required]),
      selectedStudent: new FormControl(null, [Validators.required]),
      attachments: new FormControl(null, [Validators.required, Validators.min(1)])
    });
    this.availableStudents$.subscribe(value => this.latestAvailableStudents = value);
    this.form.valueChanges.pipe(tap(() => {
      const selectedStudent = this.form.get('selectedStudent').value;
      const includedInActual = this.latestAvailableStudents.includes(selectedStudent);
      if (!includedInActual) {
        this.form.get('selectedStudent').setErrors({invalidStudent: selectedStudent}, {emitEvent: false});
      }
    })).subscribe(() => this.actions[1].valid = this.form.valid);
    this.form.updateValueAndValidity();
  }

  public dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.files.push(file);
        });
      }
    }

    this.form.patchValue({attachments: this.files.length});
  }

  removeFile(file: File) {
    this.files.splice(this.files.indexOf(file), 1);
    this.form.patchValue({attachments: this.files.length});
  }
}
