import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime, tap} from 'rxjs/operators';
import {EduStudentModel} from '../../../../core/models/students/edu-student.model';

export enum StudentFilterOptions {
  ByPublicKey = 'Public Key',
  ByName = 'Name',
  ByGroupId = 'Group Id',
  ByFaculty = 'Faculty',
}

@Component({
  selector: 'app-smart-students-list-filter-options',
  templateUrl: './smart-students-list-filter-options.component.html',
  styleUrls: ['./smart-students-list-filter-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartStudentsListFilterOptionsComponent implements OnInit, OnChanges {
  @Input() data: EduStudentModel[] = [];
  @Output() filter: EventEmitter<EduStudentModel[]> = new EventEmitter<EduStudentModel[]>();
  filterForm: FormGroup;

  options = Object.keys(StudentFilterOptions);
  optionsView = (value) => StudentFilterOptions[value];

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      filterValue: new FormControl(null),
      filterType: new FormControl(null)
    });
    this.filterForm.valueChanges.pipe(
      debounceTime(150),
      tap(valueChanged => this.filterData(valueChanged))
    ).subscribe();
  }

  filterData(filterFormValue: { filterValue: string, filterType: StudentFilterOptions }) {
    let filteredData: EduStudentModel[] = this.data;
    if (filterFormValue.filterValue) {
      switch (filterFormValue.filterType) {
        case StudentFilterOptions.ByPublicKey:
          filteredData = this.data.filter(x => x.publicKey.includes(filterFormValue.filterValue));
          break;
        case StudentFilterOptions.ByName:
          filteredData = this.data.filter(x => x.fullName.includes(filterFormValue.filterValue));
          break;
        case StudentFilterOptions.ByGroupId:
          filteredData = this.data.filter(x => x.groupId.includes(filterFormValue.filterValue));
          break;
        case StudentFilterOptions.ByFaculty:
          filteredData = this.data.filter(x => x.faculty.includes(filterFormValue.filterValue));
          break;
      }
    }
    this.filter.emit(filteredData);
  }

  ngOnChanges(): void {
    if (this.filterForm) {
      this.filterData(this.filterForm.value);
    }
  }

}
