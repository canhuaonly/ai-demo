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
    async getUser(): Promise<any> {
        let res: Observable<any> = this.http.get<any>('/api/ai/getUser')

        return new Promise((resolve) => {
            res.subscribe({ next: res => { resolve(res); } });
          });
    }

    // 获取联系人列表
    async getContactsList(): Promise<any> {
        let res: Observable<any> = this.http.get<any>('/api/ai/getContactsList')

        return new Promise((resolve) => {
            res.subscribe({ next: res => { resolve(res) } });
        });
    }

    // 获取最近聊天内容
    async getMessageList(): Promise<any> {
        let res: Observable<any> = this.http.get<any>('/api/ai/wenxin')

        return new Promise((resolve) => {
            res.subscribe({ next: res => {resolve(res) } });
          });
    }
    
    // 发送消息并取得回复
    async sendSingleMessage(entity: any): Promise<any> {
        let res: Observable<any> = this.http.post<any>('/api/ai/sendMessage', entity)

        return new Promise((resolve) => {
            res.subscribe({ next: res => { resolve(res) } });
        });
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