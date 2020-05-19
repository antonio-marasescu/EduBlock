import {Component, OnInit} from '@angular/core';
import {EduRecordModel} from '../../../../core/models/records/edu-record.model';
import {Observable} from 'rxjs';
import {EduRecordAttachmentModel} from '../../../../core/models/records/edu-record-attachment.model';
import {AppState} from '../../../../store/app.state';
import {Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {GetRecordTransactionByHash} from '../../../../store/actions/records.actions';
import {selectCurrentRecord, selectRecordsStateIsLoading} from '../../../../store/reducers/records.reducer';
import {selectFiles, selectFilesStateIsLoading} from '../../../../store/reducers/files.reducer';
import {GetFilesOfTransactionByHash} from '../../../../store/actions/files.actions';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-smart-record-details',
  templateUrl: './smart-record-details.component.html',
  styleUrls: ['./smart-record-details.component.scss']
})
export class SmartRecordDetailsComponent implements OnInit {
  isLoadingRecord$: Observable<boolean>;
  isLoadingFiles$: Observable<boolean>;
  record$: Observable<EduRecordModel>;
  recordAttachmentsDetails$: Observable<EduRecordAttachmentModel[]>;

  constructor(private store: Store<AppState>, private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.record$ = this.store.select(selectCurrentRecord);
    this.isLoadingRecord$ = this.store.select(selectRecordsStateIsLoading);
    this.isLoadingFiles$ = this.store.select(selectFilesStateIsLoading);
    this.recordAttachmentsDetails$ = this.store.select(selectFiles);
    this.activeRoute.params.subscribe(params => {
      const transactionHashId: string = params.id.toString();
      this.store.dispatch(new GetRecordTransactionByHash(transactionHashId));
      this.store.dispatch(new GetFilesOfTransactionByHash(transactionHashId));
    });
  }

  onDownloadFile(file: EduRecordAttachmentModel) {
    const fileBuffer = file.content as any;
    const arrayBuffer = Uint8Array.from(fileBuffer.data).buffer;
    const fileBlob = new Blob([arrayBuffer]);
    saveAs(fileBlob, file.filename);
  }
}
