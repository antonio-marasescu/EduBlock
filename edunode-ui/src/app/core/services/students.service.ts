import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EduStudentModel} from '../models/students/edu-student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  getStudents(): Observable<EduStudentModel[]> {
    return this.http.get<EduStudentModel[]>('api/students', this.httpOptions);
  }

  addStudent(student: EduStudentModel): Observable<EduStudentModel> {
    return this.http.post<EduStudentModel>('api/students', student, this.httpOptions);
  }
}
