import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EduRecordModel} from '../models/records/edu-record.model';
import {CreateEduRecordModel} from '../models/records/create-edu-record.model';
import {RecordsBlockModel} from '../models/block/records-block.model';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  getRecordTransactions(): Observable<EduRecordModel[]> {
    return this.http.get<EduRecordModel[]>('api/blockchain/transactions', this.httpOptions);
  }

  getRecordTransactionByHash(hashId: string): Observable<EduRecordModel> {
    return this.http.get<EduRecordModel>('api/blockchain/transactions/' + hashId, this.httpOptions);
  }

  createRecordTransaction(record: CreateEduRecordModel): Observable<EduRecordModel> {
    return this.http.post<EduRecordModel>('api/blockchain/transactions', record, this.httpOptions);
  }

  createBlock(): Observable<number> {
    return this.http.post<number>('api/blockchain', {}, this.httpOptions);
  }

  getBlockchain(): Observable<RecordsBlockModel[]> {
    return this.http.get<RecordsBlockModel[]>('api/blockchain', this.httpOptions);
  }
}
