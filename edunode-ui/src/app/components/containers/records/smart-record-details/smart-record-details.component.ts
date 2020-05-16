import {Component} from '@angular/core';
import {EduRecordModel} from '../../../../core/models/records/edu-record.model';
import {EduRecordStatus} from '../../../../core/models/records/edu-record-status.enum';
import {Observable, of} from 'rxjs';
import {EduRecordAttachmentModel} from '../../../../core/models/records/edu-record-attachment.model';

const mock: EduRecordModel = {
  id: '2qgq24t-awrg-awrgawgr',
  hash: 'q2t444444agrrgwagwagawrg',
  blockHash: 'q2t444444agrrgwagwagawrg',
  title: 'Ion-An2-Notes',
  version: 1.0,
  creatorPublicKey: 'awg4q2tgq24gqgtgarw',
  creatorSignature: 'SIG_rawhwawawarhawh',
  certificateAuthorityPublicKey: '24fagwagwagrwgrgraw',
  certificateSignature: 'SIG_heashahwahwhrwahaw',
  creationDate: new Date().toDateString(),
  targetPublicKey: 'argawgrwaq244tabawgrrawgaw',
  attachments: ['awrgagwrgrwa', 'rwaggragwargwr', 'rwaggragwarwaggragwargwrrwaggragwargwrrwaggragwargwrrgwr', 'rwaggragwargwrwaggragwargwrrwaggragwargwrr', 'rwaggragwargwr', 'rwaggragwargwr', 'rwaggragwargwr', 'rwaggragwargwrwaggragwargwrrwaggragwargwrrwaggragwargwrr', 'rwaggragwargwr', 'rwaggragwargwr', 'rwaggragwargwr', 'rwaggragwargwr'],
  status: EduRecordStatus.Certified
};
const mockRecordAttachmentDetails: { [key: string]: EduRecordAttachmentModel } = {
  awrgagwrgrwa: {
    hash: 'awrgagwrgrwa',
    filename: 'Test Filename.zip',
    encoding: 'pdf',
    size: 1515134
  } as EduRecordAttachmentModel,
  rwaggragwargwr: {
    hash: 'rwaggragwargwr',
    filename: 'Test 2Filename.pdf',
    encoding: 'pdf',
    size: 1515134
  } as EduRecordAttachmentModel
};

@Component({
  selector: 'app-smart-record-details',
  templateUrl: './smart-record-details.component.html',
  styleUrls: ['./smart-record-details.component.scss']
})
export class SmartRecordDetailsComponent {
  isLoading$: Observable<boolean> = of(false);
  record$: Observable<EduRecordModel> = of(mock);
  recordAttachmentsDetails$: Observable<{ [key: string]: EduRecordAttachmentModel }> = of(mockRecordAttachmentDetails);
}
