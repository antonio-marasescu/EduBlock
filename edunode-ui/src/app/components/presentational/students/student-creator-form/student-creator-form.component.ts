import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-student-creator-form',
  templateUrl: './student-creator-form.component.html',
  styleUrls: ['./student-creator-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentCreatorFormComponent {
  @Input() form: FormGroup;
}
