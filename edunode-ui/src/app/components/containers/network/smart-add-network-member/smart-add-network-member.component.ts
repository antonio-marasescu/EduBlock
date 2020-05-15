import {Component, OnInit} from '@angular/core';
import {ActionBarInputModel} from '../../../../core/models/actions/action-bar-input.model';
import {ActionBarType} from '../../../../core/models/actions/action-bar-type.enum';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

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

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      publicKey: new FormControl(null, [Validators.required]),
      legalIdentity: new FormControl(null, [Validators.required]),
      host: new FormControl(null, [Validators.required]),
      port: new FormControl(null, [Validators.required]),
    });
  }

  async onAction(eventName: string) {
    switch (eventName) {
      case AddNetworkMemberActionTypes.Add:
        break;
      case AddNetworkMemberActionTypes.Exit:
        await this.router.navigateByUrl('/network');
        break;
    }
  }
}
