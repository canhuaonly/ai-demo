import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class Test0002Service {

    constructor(private http: HttpClient) {}

    // 获取当前用户
    getUser(): Observable<User[]> {
        return this.http.get<Array<User>>('/api/ai/getUser')
    }

    // 获取联系人列表
    getContactsList(): Observable<Contacts[]> {
        return this.http.get<Array<Contacts>>('/api/ai/getContactsList')
    }

    // 获取最近聊天内容
    getMessageList(): Observable<MessageContent[]> {
        return this.http.get<Array<MessageContent>>('/api/ai/wenxin')
    }
    
    // 发送消息并取得回复
    sendSingleMessage(entity: MessageContent): Observable<SingleMessage> {
        return this.http.post<SingleMessage>('/api/ai/sendMessage', entity)
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

export type User = {
    user_nm: string;
};

export type Contacts = {
    user_session_aka: string;
    message: string;
};

export type MessageContent = {
    user_cd: string;
    user_nm: string;
    message_order: number;
    message: string;
    wenxin_id: number;
};

export type SingleMessage = {
    status: string;
    entity: Array<MessageContent>;
};