import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class Test0006Service {

    constructor(private http: HttpClient) {}

    // 获取当前用户
    getUser(entity: chatUser): Observable<chatUser> {
        return this.http.post<chatUser>('/api/test0006/get_user_info', entity)
    }

    // 获取会话列表
    getThreadList(entity: chatUser): Observable<chatHistoryThread[]> {
        return this.http.post<Array<chatHistoryThread>>('/api/test0006/get_history_thread_list', entity)
    }

    // 创建会话
    createThread(entity: chatHistoryThread): Observable<chatHistoryThread> {
        return this.http.post<chatHistoryThread>('/api/test0006/create_thread', entity)
    }
    
    // 更新会话名称
    updateThreadTitle(entity: chatHistoryThread): Observable<any> {
        return this.http.post<any>('/api/test0006/update_thread_title', entity)
    }

    // 获取历史信息
    getHistoryMessage(entity: chatHistoryThread): Observable<chatHistoryMessage[]> {
        return this.http.post<Array<chatHistoryMessage>>('/api/test0006/get_history_message', entity)
    }

    // 发送消息并取得回复(流式传输)
    interactiveMessageStream(list: chatHistoryMessage[], signal: AbortSignal): Promise<Response> {
        return fetch('/api/test0006/interactive_message_stream', {
            method: 'post',
            headers: {'Content-Type': 'text/plain'},
            body: JSON.stringify(list),
            signal
          })
    }
    
    // 历史对话登录
    addHistoryMessage(entity: chatHistoryMessage): Observable<any> {
        return this.http.post<any>('/api/test0006/add_history_message', entity)
    }
    
    // 会话删除
    deleteThread(entity: chatHistoryThread): Observable<any> {
        return this.http.post<any>('/api/test0006/delete_thread', entity)
    }
    
}

export type chatUser = {
    // 登录用户
    id?: string;
    user_id: string; // pk
    user_nm: string;
    del_flg?: string;
};

export type chatHistoryThread = {
    // 聊天记录线程
    id?: string;
    user_id?: string;
    application_id?: string;
    user_application_id?: string; //pk
    thread_id: string;
    thread_title?: string;
    last_question?: string;
    last_question_timestamp?: string;
    del_flg?: string;
    isEditable?: boolean;
    isSelected?: boolean;
};

export type chatHistoryFile = {
    // 聊天记录文件
    id?: string;
    thread_id: string; // pk
    file_id: string;
    file_upload_path: string;
    del_flg: string;
};

export type chatHistoryMessage = {
    // 聊天记录
    id?: string;
    thread_id: string; // pk
    message_question: string;
    message_answer: string;
    question_timestamp?: string;
    answer_timestamp?: string;
    token?: string;
    del_flg?: string;
    message_question_md?: string;
    message_answer_md?: string;
};