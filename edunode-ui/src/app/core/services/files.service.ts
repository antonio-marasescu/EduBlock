import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EduRecordAttachmentModel} from '../models/records/edu-record-attachment.model';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  uploadFile(file: File): Observable<EduRecordAttachmentModel> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<EduRecordAttachmentModel>('api/files', formData);
  }

  getFilesForTransaction(transactionId: string): Observable<EduRecordAttachmentModel[]> {
    return this.http.get<EduRecordAttachmentModel[]>('api/files/' + transactionId, this.httpOptions);
  }
}
