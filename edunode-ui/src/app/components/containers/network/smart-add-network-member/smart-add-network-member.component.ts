import {Component, OnInit} from '@angular/core';
import {ActionBarInputModel} from '../../../../core/models/actions/action-bar-input.model';
import {ActionBarType} from '../../../../core/models/actions/action-bar-type.enum';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {AddNetworkMember} from '../../../../store/actions/network-members.actions';
import {AddNetworkMemberModel} from '../../../../core/models/network/add-network-member.model';

export enum AddNetworkMemberActionTypes {
  Add = 'add',
  Exit = 'exit'
}

@Component({
  selector: 'app-smart-add-network-member',
  templateUrl: './smart-add-network-member.component.html',
  styleUrls: ['./smart-add-network-member.component.scss']
})
export class SmartAddNetworkMemberComponent implements OnInit {
  form: FormGroup;
  actions: ActionBarInputModel[] = [
    {eventName: AddNetworkMemberActionTypes.Exit, type: ActionBarType.STANDARD, displayContent: 'Close'},
    {eventName: AddNetworkMemberActionTypes.Add, type: ActionBarType.ACCENT, displayContent: 'Add Member'},
  ];

  constructor(private router: Router, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      publicKey: new FormControl(null, [Validators.required]),
      legalIdentity: new FormControl(null, [Validators.required]),
      host: new FormControl(null, [Validators.required]),
      port: new FormControl(null, [Validators.required]),
    });
    this.form.valueChanges.subscribe(() => this.actions[1].valid = this.form.valid);
    this.form.updateValueAndValidity();
  }

  async onAction(eventName: string) {
    switch (eventName) {
      case AddNetworkMemberActionTypes.Add:
        const payload: AddNetworkMemberModel = {
          publicKey: this.form.get('publicKey').value,
          legalIdentity: this.form.get('legalIdentity').value,
          host: this.form.get('host').value,
          port: parseInt(this.form.get('port').value, 10),
        };
        this.store.dispatch(new AddNetworkMember(payload));
        break;
      case AddNetworkMemberActionTypes.Exit:
        await this.router.navigateByUrl('/network');
        break;
    }
  }
}
