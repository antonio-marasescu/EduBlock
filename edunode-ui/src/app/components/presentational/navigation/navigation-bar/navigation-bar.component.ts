import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {PersonalIdentityModel} from '../../../../core/models/network/personal-identity.model';
import {UserDetailsModel} from '../../../../core/models/users/user-details.model';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationBarComponent implements OnChanges {
  @Input() personalIdentity: PersonalIdentityModel;
  @Input() user: UserDetailsModel;
  @Output() logout: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(MatSidenav) sidenav: MatSidenav;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.sidenav) {
      this.sidenav.close().then();
    }
  }
}
