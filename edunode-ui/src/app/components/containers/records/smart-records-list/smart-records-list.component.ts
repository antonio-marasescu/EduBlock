import {Component, OnInit} from '@angular/core';
import {ActionBarInputModel} from '../../../../core/models/actions/action-bar-input.model';
import {ActionBarType} from '../../../../core/models/actions/action-bar-type.enum';
import {Router} from '@angular/router';
import {EduRecordModel} from '../../../../core/models/records/edu-record.model';
import {Observable, of} from 'rxjs';
import {AppState} from '../../../../store/app.state';
import {Store} from '@ngrx/store';
import {GetRecordsTransaction} from '../../../../store/actions/records.actions';
import {selectRecords, selectRecordsStateIsLoading} from '../../../../store/reducers/records.reducer';

export enum RecordsListActionTypes {
  CREATE_TRANSACTION = 'create-transaction',
  CREATE_BLOCK = 'create-block'
}

@Component({
  selector: 'app-smart-records-list',
  templateUrl: './smart-records-list.component.html',
  styleUrls: ['./smart-records-list.component.scss']
})
export class SmartRecordsListComponent implements OnInit {

  records$: Observable<EduRecordModel[]>;
  filteredRecords$: Observable<EduRecordModel[]> = of([]);
  isLoading$: Observable<boolean>;

  actions: ActionBarInputModel[] = [
    {
      eventName: RecordsListActionTypes.CREATE_TRANSACTION,
      type: ActionBarType.ACCENT,
      displayContent: 'Create Record'
    },
    {eventName: RecordsListActionTypes.CREATE_BLOCK, type: ActionBarType.ACCENT, displayContent: 'Create Block'},
  ];

  constructor(private router: Router, private store: Store<AppState>) {
  }

  async onAction(eventName: string) {
    switch (eventName) {
      case RecordsListActionTypes.CREATE_TRANSACTION:
        await this.router.navigateByUrl('/records/create');
        break;
      case RecordsListActionTypes.CREATE_BLOCK:
        break;
    }
  }

  onFilterEvent(filteredData: EduRecordModel[]) {
    this.filteredRecords$ = of(filteredData);
  }

  ngOnInit(): void {
    this.records$ = this.store.select(selectRecords);
    this.isLoading$ = this.store.select(selectRecordsStateIsLoading);
    this.store.dispatch(new GetRecordsTransaction());

  }
}
