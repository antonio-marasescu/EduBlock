import {Component} from '@angular/core';
import {ActionBarInputModel} from '../../../../core/models/actions/action-bar-input.model';
import {ActionBarType} from '../../../../core/models/actions/action-bar-type.enum';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {EduStudentModel} from '../../../../core/models/students/edu-student.model';

const mockData: EduStudentModel[] = [
  {
    publicKey: '2qgq24t-awrg-awrgawgr',
    fullName: 'Ion matur',
    groupId: '304431',
    faculty: 'Calculatore Borate',
  },
  {
    publicKey: '3qgq24t-awrg-awrgawgr',
    fullName: 'ADy matur',
    groupId: '304441',
    faculty: 'Calculatore Borate',
  },
];


export enum StudentsListActionTypes {
  ADD_STUDENT = 'add-student'
}

@Component({
  selector: 'app-smart-students-list',
  templateUrl: './smart-students-list.component.html',
  styleUrls: ['./smart-students-list.component.scss']
})
export class SmartStudentsListComponent {

  students$: Observable<EduStudentModel[]> = of(mockData).pipe(delay(500));
  filteredStudents$: Observable<EduStudentModel[]> = of([]);
  isLoading$: Observable<boolean> = of(false);

  actions: ActionBarInputModel[] = [
    {
      eventName: StudentsListActionTypes.ADD_STUDENT,
      type: ActionBarType.ACCENT,
      displayContent: 'Add Student'
    },
  ];

  constructor(private router: Router) {
  }

  async onAction(eventName: string) {
    if (eventName === StudentsListActionTypes.ADD_STUDENT) {
      await this.router.navigateByUrl('/students/create');
    }
  }

  onFilterEvent(filteredData: EduStudentModel[]) {
    this.filteredStudents$ = of(filteredData);
  }
}
