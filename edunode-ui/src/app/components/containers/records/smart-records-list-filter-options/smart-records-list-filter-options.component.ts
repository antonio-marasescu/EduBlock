import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {EduRecordModel} from '../../../../core/models/records/edu-record.model';
import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime, tap} from 'rxjs/operators';

export enum RecordFilterOptions {
  ById = 'Record Id',
  ByBlock = 'Block Hash',
  ByHash = 'Record Hash',
  ByStudent = 'Student Public key',
  ByStatus = 'Record Status'
}

@Component({
  selector: 'app-smart-records-list-filter-options',
  templateUrl: './smart-records-list-filter-options.component.html',
  styleUrls: ['./smart-records-list-filter-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartRecordsListFilterOptionsComponent implements OnInit, OnChanges {
  @Input() data: EduRecordModel[] = [];
  @Output() filter: EventEmitter<EduRecordModel[]> = new EventEmitter<EduRecordModel[]>();
  filterForm: FormGroup;

  options = Object.keys(RecordFilterOptions);
  optionsView = (value) => RecordFilterOptions[value];

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

  filterData(filterFormValue: { filterValue: string, filterType: RecordFilterOptions }) {
    let filteredData: EduRecordModel[] = this.data;
    if (filterFormValue.filterValue) {
      switch (filterFormValue.filterType) {
        case RecordFilterOptions.ById:
          filteredData = this.data.filter(x => x.id.includes(filterFormValue.filterValue));
          break;
        case RecordFilterOptions.ByBlock:
          filteredData = this.data.filter(x => x.blockHash.includes(filterFormValue.filterValue));
          break;
        case RecordFilterOptions.ByHash:
          filteredData = this.data.filter(x => x.hash.includes(filterFormValue.filterValue));
          break;
        case RecordFilterOptions.ByStudent:
          filteredData = this.data.filter(x => x.targetPublicKey.includes(filterFormValue.filterValue));
          break;
        case RecordFilterOptions.ByStatus:
          filteredData = this.data.filter(x => x.status.includes(filterFormValue.filterValue));
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
