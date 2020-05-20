import {Component, Input} from '@angular/core';
import {EduStudentModel} from '../../../../core/models/students/edu-student.model';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent {
  @Input() students: EduStudentModel[];
  displayedColumns: string[] = ['publicKey', 'fullName', 'groupId', 'faculty'];
  displayedColumnsTitleFormat: { [key: string]: string } = {
    publicKey: 'Public Key',
    fullName: 'Name',
    groupId: 'Group Id',
    faculty: 'Faculty'
  };
}
