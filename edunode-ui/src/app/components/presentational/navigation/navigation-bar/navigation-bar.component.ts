import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PersonalIdentityModel} from '../../../../core/models/network/personal-identity.model';
import {UserDetailsModel} from '../../../../core/models/users/user-details.model';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  @Input() personalIdentity: PersonalIdentityModel;
  @Input() user: UserDetailsModel;
  @Output() logout: EventEmitter<void> = new EventEmitter<void>();
}
