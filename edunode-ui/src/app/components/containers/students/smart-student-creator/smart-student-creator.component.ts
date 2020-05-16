import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActionBarInputModel} from '../../../../core/models/actions/action-bar-input.model';
import {ActionBarType} from '../../../../core/models/actions/action-bar-type.enum';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {tap} from 'rxjs/operators';

export enum StudentCreatorActionTypes {
  CREATE = 'create',
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
    {
      eventName: StudentCreatorActionTypes.GENERATE,
      type: ActionBarType.ACCENT,
      displayContent: 'Generate Private/Public Keys'
    },
    {eventName: StudentCreatorActionTypes.CREATE, type: ActionBarType.ACCENT, displayContent: 'Create'},
  ];
  form: FormGroup;
  eccInitialized: boolean;

  constructor(private router: Router, private changeDetectorRef: ChangeDetectorRef) {
  }

  async onAction(eventName: string) {
    switch (eventName) {
      case StudentCreatorActionTypes.EXIT:
        await this.router.navigateByUrl('/students');
        break;
      case StudentCreatorActionTypes.GENERATE:
        this.generatePublicPrivateKey();
        break;
      case StudentCreatorActionTypes.CREATE:
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
      console.log(privateKey);
      console.log(privateKey);
      if (!publicKey || !privateKey) {
        this.form.get('pair').setErrors({privateKey: 'Could not find the public key'}, {emitEvent: false});
      } else {
        this.form.get('pair').setErrors(null, {emitEvent: false});
      }
    })).subscribe(() => this.actions[2].valid = this.form.valid);
    this.form.updateValueAndValidity();
  }

  generatePublicPrivateKey(): void {
    this.loading = true;
    const worker = new Worker('../../../../workers/keypair-generator.worker', {type: 'module'});
    worker.onmessage = (message) => {
      this.form.patchValue({publicKey: message.data.public, privateKey: message.data.private});
      this.loading = false;
    };
  }

}
