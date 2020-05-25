import {Component, OnInit} from '@angular/core';
import {ActionBarInputModel} from '../../../../core/models/actions/action-bar-input.model';
import {ActionBarType} from '../../../../core/models/actions/action-bar-type.enum';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {tap} from 'rxjs/operators';
import {EduStudentModel} from '../../../../core/models/students/edu-student.model';
import {AppState} from '../../../../store/app.state';
import {Store} from '@ngrx/store';
import {AddStudent} from '../../../../store/actions/students.actions';
import {MatSnackBar} from '@angular/material/snack-bar';
import {JsonPipe} from '@angular/common';

export enum StudentCreatorActionTypes {
  CREATE = 'create',
  EXPORT = 'export',
  GENERATE = 'generate',
  EXIT = 'exit'
}

@Component({
  selector: 'app-smart-student-creator',
  templateUrl: './smart-student-creator.component.html',
  styleUrls: ['./smart-student-creator.component.scss']
})
export class SmartStudentCreatorComponent implements OnInit {
  loading = false;
  actions: ActionBarInputModel[] = [
    {eventName: StudentCreatorActionTypes.EXIT, type: ActionBarType.STANDARD, displayContent: 'Close'},
    {eventName: StudentCreatorActionTypes.EXPORT, type: ActionBarType.ACCENT, displayContent: 'Export Keys'},
    {
      eventName: StudentCreatorActionTypes.GENERATE,
      type: ActionBarType.ACCENT,
      displayContent: 'Generate Private/Public Keys'
    },
    {eventName: StudentCreatorActionTypes.CREATE, type: ActionBarType.ACCENT, displayContent: 'Create'},
  ];
  form: FormGroup;
  eccInitialized: boolean;

  constructor(private router: Router, private store: Store<AppState>, private snackBar: MatSnackBar, private jsonPipe: JsonPipe) {
  }

  async onAction(eventName: string) {
    switch (eventName) {
      case StudentCreatorActionTypes.EXIT:
        await this.router.navigateByUrl('/students');
        break;
      case StudentCreatorActionTypes.EXPORT:
        const keys = {
          publicKey: this.form.get('publicKey').value,
          privateKey: this.form.get('privateKey').value,
        };
        await navigator.clipboard.writeText(this.jsonPipe.transform(keys));
        this.snackBar.open('Keys have been copied to the clipboard', 'Ok', {duration: 2000});
        break;
      case StudentCreatorActionTypes.GENERATE:
        this.snackBar.open('Generating public and private key pair', 'Ok', {duration: 2000});
        this.generatePublicPrivateKey();
        break;
      case StudentCreatorActionTypes.CREATE:
        const publicKey = this.form.get('publicKey').value;
        const fullName = this.form.get('fullName').value;
        const groupId = this.form.get('groupId').value;
        const faculty = this.form.get('faculty').value;
        const payload: EduStudentModel = {publicKey, fullName, groupId, faculty};
        this.store.dispatch(new AddStudent(payload));
        break;
    }
  }

  ngOnInit(): void {
    this.eccInitialized = false;
    this.form = new FormGroup({
      publicKey: new FormControl({value: null, disabled: true}, [Validators.required, Validators.minLength(1)]),
      privateKey: new FormControl({value: null, disabled: true}, [Validators.required, Validators.minLength(1)]),
      fullName: new FormControl(null, [Validators.required]),
      groupId: new FormControl(null, [Validators.required]),
      faculty: new FormControl(null, [Validators.required]),
      pair: new FormControl()
    });
    this.form.valueChanges.pipe(tap(() => {
      const publicKey = this.form.get('publicKey').value;
      const privateKey = this.form.get('privateKey').value;
      if (!publicKey || !privateKey) {
        this.form.get('pair').setErrors({privateKey: 'Could not find the public key'}, {emitEvent: false});
      } else {
        this.form.get('pair').setErrors(null, {emitEvent: false});
      }
    })).subscribe(() => this.actions[3].valid = this.form.valid);
    this.form.updateValueAndValidity();
  }

  generatePublicPrivateKey(): void {
    this.loading = true;
    this.actions[1].valid = false;
    this.actions[2].valid = false;
    const worker = new Worker('../../../../workers/keypair-generator.worker', {type: 'module'});
    worker.onmessage = (message) => {
      this.form.patchValue({publicKey: message.data.public, privateKey: message.data.private});
      this.loading = false;
      this.actions[1].valid = true;
      this.actions[2].valid = true;
    };
  }

}
