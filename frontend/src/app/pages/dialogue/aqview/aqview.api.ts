import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})

export class AqviewService {
 
  constructor(private http: HttpClient) { }
 
  wenxinApi(query: any): Observable<any> {
    return this.http.post('/api/dialogue_ctx/wenxin_api', query);
  }

  getQaListApi(query: any): Observable<any> {
    return this.http.post('/api/dialogue_ctx/get_qa_list', query);
  }
}