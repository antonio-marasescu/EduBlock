import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-network-member-form',
  templateUrl: './network-member-form.component.html',
  styleUrls: ['./network-member-form.component.scss']
})
export class NetworkMemberFormComponent {
  @Input() form: FormGroup;
}
