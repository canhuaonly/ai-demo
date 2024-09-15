import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class Test0005Service {

    constructor(private http: HttpClient) {}

    // 获取当前用户
    getUser(entity: HttpParam): Observable<LoginUser[]> {
        return this.http.post<Array<LoginUser>>('/api/cosmos_api/test0005/get_user', entity)
    }

    // 获取最近联系人
    getContacts(entity: HttpParam): Observable<Contacts[]> {
        return this.http.post<Array<Contacts>>('/api/cosmos_api/test0005/get_recent_contacts', entity)
    }

    // 获取最近聊天内容
    getMessageList(entity: HttpParam): Observable<Messages[]> {
        return this.http.post<Array<Messages>>('/api/cosmos_api/test0005/get_message', entity)
    }
    
    // 发送消息并取得回复
    sendSingleMessage(entity: HttpParam): Observable<SendSingleMessage> {
        return this.http.post<SendSingleMessage>('/api/cosmos_api/test0005/send_message', entity)
    }
    
    // 更新会话名称
    updateContactNm(entity: HttpParam): Observable<UpdateContactNm> {
        return this.http.post<UpdateContactNm>('/api/cosmos_api/test0005/update_contact_nm', entity)
    }
    
    // 发送消息并取得回复(流式传输)
    sendMessageStream(entity: HttpParam) {
        return fetch('/api/cosmos_api/test0005/send_message_stream', {
            method: 'post',
            headers: {'Content-Type': 'text/plain'},
            body: JSON.stringify(entity)
          })
    }
}

export type HttpParam = {
    data: string;
    user: string;
    chat_id: string;
};

export type LoginUser = {
    // 登录用户
    id: string;
    userId: string;
    userCd: string;
    userNm: string;
    partitionKey: string;
    delFlg: string;
};

export type Contacts = {
    // 联系人列表
    id: string;
    user_id: string;
    contact_nm: string;
    last_msg: string;
    del_flg: string;
};

export type Messages = {
    // 聊天内容
    chat_id: string;
    message_q: string;
    message_a: string;
    del_flg: string;
};

export type SendSingleMessage = {
    status: string;
    entity: Contacts;
};

export type UpdateContactNm = {
    status: string;
    entity: Contacts;
};