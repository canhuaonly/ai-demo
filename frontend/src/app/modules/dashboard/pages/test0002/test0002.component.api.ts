import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})

export class Test0002Service {

    constructor(private http: HttpClient) {}

    // 获取当前用户
    getUser(): Observable<any> {
        return this.http.get<any>('/api/ai/getUser')
    }

    // 获取联系人列表
    getContactsList(): Observable<any> {
        return this.http.get<any>('/api/ai/getContactsList')
    }

    // 获取最近聊天内容
    getMessageList(): Observable<any> {
        return this.http.get<any>('/api/ai/wenxin')
    }
    
    sendMessage(messageList: any): Observable<any> {
        return this.http.post<any>('/api/ai/sendMessage', messageList)
    }
    
    sendSingleMessage(entity: any): Observable<any> {
        return this.http.post<any>('/api/ai/sendMessage', entity)
    }
}

// 真实的请求
export function getData() {
    // success: true
    return axios.get("http://www.dell-lee.com/react/api/demo.json");
}

// 模拟的请求
export function fetchData() {
    return Promise.resolve({
      success: true
    });
}

// temp
export const all = async () => {
    const resp = await axios.get('xxxxxxx');
    return resp.data;
}