import {Component, OnInit} from '@angular/core';
import {ActionBarInputModel} from '../../../../core/models/actions/action-bar-input.model';
import {ActionBarType} from '../../../../core/models/actions/action-bar-type.enum';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {EduStudentModel} from '../../../../core/models/students/edu-student.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {filter, tap} from 'rxjs/operators';
import {AppState} from '../../../../store/app.state';
import {Store} from '@ngrx/store';
import {ClearUploadedFiles, UploadFile} from '../../../../store/actions/files.actions';
import {EduRecordAttachmentModel} from '../../../../core/models/records/edu-record-attachment.model';
import {selectFilesStateIsUploadingFiles, selectUploadedFiles} from '../../../../store/reducers/files.reducer';
import {CreateEduRecordModel} from '../../../../core/models/records/create-edu-record.model';
import {CreateRecordTransaction} from '../../../../store/actions/records.actions';
import {selectStudents, selectStudentsStateIsLoading} from '../../../../store/reducers/students.reducer';
import {GetStudents} from '../../../../store/actions/students.actions';

export enum RecordCreatorActionTypes {
  CREATE = 'create',
  EXIT = 'exit'
}

@Component({
  selector: 'app-smart-record-creator',
  templateUrl: './smart-record-creator.component.html',
  styleUrls: ['./smart-record-creator.component.scss']
})
export class SmartRecordCreatorComponent implements OnInit {

  isLoadingFiles$: Observable<boolean> = of(false);
  isLoadingStudents$: Observable<boolean> = of(false);
  latestAvailableStudents: EduStudentModel[] = [];
  availableStudents$: Observable<EduStudentModel[]>;
  actions: ActionBarInputModel[] = [
    {eventName: RecordCreatorActionTypes.EXIT, type: ActionBarType.STANDARD, displayContent: 'Close'},
    {eventName: RecordCreatorActionTypes.CREATE, type: ActionBarType.ACCENT, displayContent: 'Create'},
  ];
  form: FormGroup;
  files: File[] = [];
  filesUploaded$: Observable<EduRecordAttachmentModel[]>;
  isCreating = false;

  constructor(private router: Router, private store: Store<AppState>) {
  }

  async onAction(eventName: string) {
    switch (eventName) {
      case RecordCreatorActionTypes.EXIT:
        await this.router.navigateByUrl('/records');
        break;
      case RecordCreatorActionTypes.CREATE:
        this.isCreating = true;
        this.actions[1].valid = false;
        for (const file of this.files) {
          this.store.dispatch(new UploadFile(file));
        }
        break;
    }
  }

  ngOnInit(): void {
    this.isCreating = false;
    this.store.dispatch(new ClearUploadedFiles());

    this.isLoadingFiles$ = this.store.select(selectFilesStateIsUploadingFiles);
    this.isLoadingStudents$ = this.store.select(selectStudentsStateIsLoading);

    this.availableStudents$ = this.store.select(selectStudents);
    this.filesUploaded$ = this.store.select(selectUploadedFiles);

    this.filesUploaded$.pipe(
      filter(x => !!x),
      filter(value => value.length > 0),
      filter(value => !this.isCreating || (value.length === this.files.length))
    )
      .subscribe(value => {
        const title = this.form.get('recordTitle').value;
        const student: EduStudentModel = this.form.get('selectedStudent').value;
        const attachments = value.map(x => x.hash);
        const record: CreateEduRecordModel = {studentPublicKey: student.publicKey, title, attachments};
        this.store.dispatch(new CreateRecordTransaction(record));
      });
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
    })).subscribe(() => this.actions[1].valid = this.form.valid && !this.isCreating);
    this.form.updateValueAndValidity();

    this.store.dispatch(new GetStudents());
  }

  public dropped(files: NgxFileDropEntry[]) {
    if (this.isCreating) {
      return;
    }
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
    if (this.isCreating) {
      return;
    }
    this.files.splice(this.files.indexOf(file), 1);
    this.form.patchValue({attachments: this.files.length});
  }
}
