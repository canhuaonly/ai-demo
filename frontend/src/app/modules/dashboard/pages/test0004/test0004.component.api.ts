import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class Test0004Service {

    constructor(private http: HttpClient) {}

    // 获取当前用户
    getUser(entity: HttpParam): Observable<LoginUser[]> {
        return this.http.post<Array<LoginUser>>('/api/cosmos_api/test0004/get_user', entity)
    }

    // 获取最近联系人
    getContacts(entity: HttpParam): Observable<RecentContacts[]> {
        return this.http.post<Array<RecentContacts>>('/api/cosmos_api/test0004/get_recent_contacts', entity)
    }

    // 获取最近聊天内容
    getMessageList(entity: HttpParam): Observable<MessageContent[]> {
        return this.http.post<Array<MessageContent>>('/api/cosmos_api/test0004/get_message', entity)
    }
    
    // 发送消息并取得回复
    sendSingleMessage(entity: HttpParam): Observable<SingleMessage> {
        return this.http.post<SingleMessage>('/api/cosmos_api/test0004/send_message', entity)
    }
    
    // 更新会话名称
    updateContactNm(entity: HttpParam): Observable<UpdateContactNm> {
        return this.http.post<UpdateContactNm>('/api/cosmos_api/test0004/update_contact_nm', entity)
    }
}

export type LoginUser = {
    id: string;
    userId: string;
    userCd: string;
    userNm: string;
    partitionKey: string;
    delFlg: string;
};

export type User = {
    id: string;
    userId: string;
    userCd: string;
    userNm: string;
    delFlg: string;
};

export type RecentContacts = {
    id: string;
    userId: string;
    userNm: string;
    lastMsg: string;
};

export type MessageContent = {
    chatId: string;
    message_q: string;
    message_a: string;
};

export type SingleMessage = {
    status: string;
    entity: MessageContent;
};

export type HttpParam = {
    data: string;
    user: string;
    chatId: string;
};

export type UpdateContactNm = {
    status: string;
    entity: User;
};