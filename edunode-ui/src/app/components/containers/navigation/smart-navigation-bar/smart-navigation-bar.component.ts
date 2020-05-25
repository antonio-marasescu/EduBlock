import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UserDetailsModel} from '../../../../core/models/users/user-details.model';
import {Observable} from 'rxjs';
import {PersonalIdentityModel} from '../../../../core/models/network/personal-identity.model';
import {AppState} from '../../../../store/app.state';
import {Store} from '@ngrx/store';
import {GetCurrentUser, LogoutUser} from '../../../../store/actions/auth.actions';
import {GetNetworkPersonalIdentity} from '../../../../store/actions/network-members.actions';
import {selectAuthUser} from '../../../../store/reducers/auth.reducer';
import {selectNetworkPersonalIdentity} from '../../../../store/reducers/network-members.reducer';
import {Router} from '@angular/router';

@Component({
  selector: 'app-smart-navigation-bar',
  templateUrl: './smart-navigation-bar.component.html',
  styleUrls: ['./smart-navigation-bar.component.scss']
})
export class SmartNavigationBarComponent implements OnInit {
  user$: Observable<UserDetailsModel>;
  personalIdentity$: Observable<PersonalIdentityModel>;

  constructor(private store: Store<AppState>, private router: Router) {
  }

  ngOnInit(): void {
    this.user$ = this.store.select(selectAuthUser);
    this.personalIdentity$ = this.store.select(selectNetworkPersonalIdentity);
    if (!this.isUrlWhitelisted()) {
      this.store.dispatch(new GetCurrentUser(false));
      this.store.dispatch(new GetNetworkPersonalIdentity());
    }
  }

  isUrlWhitelisted(): boolean {
    return this.router.url.includes('login') || this.router.url.includes('register');
  }

  onLogout() {
    this.store.dispatch(new LogoutUser());
  }
}
