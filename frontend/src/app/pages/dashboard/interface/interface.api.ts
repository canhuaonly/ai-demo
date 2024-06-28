import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})

export class InterfaceService {
 
  constructor(private http: HttpClient) { }
 
  listApi(query: any): Observable<any> {
    return this.http.post('/api/interface/list', query);
  } 

  wenxinApi(query: any): Observable<any> {
    return this.http.post('/api/interface/wenxin_api', query);
  }
}