import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NetworkMemberModel} from '../models/network/network-member.model';
import {AddNetworkMemberModel} from '../models/network/add-network-member.model';

@Injectable({
  providedIn: 'root'
})
export class NetworkMembersService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  getNetworkMembers(): Observable<NetworkMemberModel[]> {
    return this.http.get<NetworkMemberModel[]>('api/network/members', this.httpOptions);
  }

  learnNetworkMembers(): Observable<NetworkMemberModel[]> {
    return this.http.get<NetworkMemberModel[]>('api/network/learn', this.httpOptions);
  }

  addNetworkMember(payload: AddNetworkMemberModel): Observable<NetworkMemberModel> {
    return this.http.post<NetworkMemberModel>('api/network/members', payload, this.httpOptions);
  }
}
