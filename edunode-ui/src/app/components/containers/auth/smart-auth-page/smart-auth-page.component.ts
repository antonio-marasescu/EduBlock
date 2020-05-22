import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AppState} from '../../../../store/app.state';
import {Store} from '@ngrx/store';
import {LoginUser} from '../../../../store/actions/auth.actions';
import {UserCredentialsModel} from '../../../../core/models/users/user-credentials.model';

@Component({
  selector: 'app-smart-auth-page',
  templateUrl: './smart-auth-page.component.html',
  styleUrls: ['./smart-auth-page.component.scss']
})
export class SmartAuthPageComponent implements OnInit {
  form: FormGroup;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  onLogin() {
    const payload: UserCredentialsModel = {
      email: this.form.get('email').value,
      password: this.form.get('password').value
    };
    this.store.dispatch(new LoginUser(payload));
  }
}
