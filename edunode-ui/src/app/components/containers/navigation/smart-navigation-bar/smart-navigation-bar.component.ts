import {Component} from '@angular/core';
import {UserDetailsModel} from '../../../../core/models/users/user-details.model';

const mockUser = {
  username: 'UniversityOfAmsterdam',
  legalIdentity: 'University of Amsterdam',
  role: 'University'
};

@Component({
  selector: 'app-smart-navigation-bar',
  templateUrl: './smart-navigation-bar.component.html',
  styleUrls: ['./smart-navigation-bar.component.scss']
})
export class SmartNavigationBarComponent {
  user: UserDetailsModel = mockUser;
}
