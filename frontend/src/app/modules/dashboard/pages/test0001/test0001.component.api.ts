import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})

export class Test0001Service {

    constructor(private http: HttpClient) {}

    getData(): Observable<any> {
        // return this.http.get<any>('http://127.0.0.1:8000/getLyric/aaa')
        return this.http.get<any>('/api/ai/getLyric/aaa')
        
    }
}

// 模拟接口函数
export function fetchData() {
    // 模拟接口调用，这里可以根据实际情况改写
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(1000);
        }, 1000);
    });
}

// 真实的请求
export function getData() {
    // success: true
    return axios.get("http://www.dell-lee.com/react/api/demo.json");
}

// 模拟的请求
export function fetchData2() {
    return Promise.resolve({
      success: true
    });
}

// temp
export const all = async () => {
    const resp = await axios.get('xxxxxxx');
    return resp.data;
}