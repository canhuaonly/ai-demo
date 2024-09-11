import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class Test0004Service {

    constructor(private http: HttpClient) {}

    // 获取当前用户
    async getUser(entity: HttpParam): Promise<Array<LoginUser>> {
        const res: Observable<Array<LoginUser>> = this.http.post<Array<LoginUser>>('/api/cosmos_api/test0004/get_user', entity)

        return new Promise((resolve) => {
            res.subscribe({ next: res => { resolve(res); } });
          });
    }

    // 获取最近联系人
    async getContacts(entity: HttpParam): Promise<Array<RecentContacts>> {
        const res: Observable<Array<RecentContacts>> = this.http.post<Array<RecentContacts>>('/api/cosmos_api/test0004/get_recent_contacts', entity)

        return new Promise((resolve) => {
            res.subscribe({ next: res => { resolve(res); } });
          });
    }

    // 获取最近聊天内容
    async getMessageList(entity: HttpParam): Promise<Array<MessageContent>> {
        const res: Observable<Array<MessageContent>> = this.http.post<Array<MessageContent>>('/api/cosmos_api/test0004/get_message', entity)

        return new Promise((resolve) => {
            res.subscribe({ next: res => { resolve(res) } });
          });
    }
    
    // 发送消息并取得回复
    async sendSingleMessage(entity: HttpParam): Promise<SingleMessage> {
        const res: Observable<SingleMessage> = this.http.post<SingleMessage>('/api/cosmos_api/test0004/send_message', entity)

        return new Promise((resolve) => {
            res.subscribe({ next: res => { resolve(res) } });
        });
    }
    
    // 更新会话名称
    async updateContactNm(entity: HttpParam): Promise<UpdateContactNm> {
        const res: Observable<UpdateContactNm> = this.http.post<UpdateContactNm>('/api/cosmos_api/test0004/update_contact_nm', entity)

        return new Promise((resolve) => {
            res.subscribe({ next: res => { resolve(res) } });
        });
    }

    // 创建新的聊天
    createNewChats(index: number) {
        const res = {
            user_session_aka: '文心一言' + '(' + index + ')',
            message: 'hi, 测试一个会话'
        }
        return res;
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