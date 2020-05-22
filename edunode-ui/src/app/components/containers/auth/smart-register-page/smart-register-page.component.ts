import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AppState} from '../../../../store/app.state';
import {Store} from '@ngrx/store';
import {RegisterUser} from '../../../../store/actions/auth.actions';
import {UserCredentialsModel} from '../../../../core/models/users/user-credentials.model';

@Component({
  selector: 'app-smart-register-page',
  templateUrl: './smart-register-page.component.html',
  styleUrls: ['./smart-register-page.component.scss']
})
export class SmartRegisterPageComponent implements OnInit {
  form: FormGroup;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  onRegister() {
    const payload: UserCredentialsModel = {
      email: this.form.get('email').value,
      password: this.form.get('password').value
    };
    this.store.dispatch(new RegisterUser(payload));
  }
}
