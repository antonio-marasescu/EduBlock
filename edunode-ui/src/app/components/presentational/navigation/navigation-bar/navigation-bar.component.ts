import {Component, Input} from '@angular/core';
import {UserDetailsModel} from '../../../../core/models/users/user-details.model';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  @Input() user: UserDetailsModel;
}
