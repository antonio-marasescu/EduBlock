import {Component, OnInit} from '@angular/core';
import {ActionBarInputModel} from '../../../../core/models/actions/action-bar-input.model';
import {ActionBarType} from '../../../../core/models/actions/action-bar-type.enum';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {EduStudentModel} from '../../../../core/models/students/edu-student.model';
import {AppState} from '../../../../store/app.state';
import {Store} from '@ngrx/store';
import {selectStudents, selectStudentsStateIsLoading} from '../../../../store/reducers/students.reducer';
import {GetStudents} from '../../../../store/actions/students.actions';


export enum StudentsListActionTypes {
  ADD_STUDENT = 'add-student'
}

@Component({
  selector: 'app-smart-students-list',
  templateUrl: './smart-students-list.component.html',
  styleUrls: ['./smart-students-list.component.scss']
})
export class SmartStudentsListComponent implements OnInit {
  students$: Observable<EduStudentModel[]>;
  filteredStudents$: Observable<EduStudentModel[]>;
  isLoading$: Observable<boolean>;

  actions: ActionBarInputModel[] = [
    {
      eventName: StudentsListActionTypes.ADD_STUDENT,
      type: ActionBarType.ACCENT,
      displayContent: 'Add Student'
    },
  ];

  constructor(private router: Router, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.students$ = this.store.select(selectStudents);
    this.isLoading$ = this.store.select(selectStudentsStateIsLoading);
    this.store.dispatch(new GetStudents());
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
