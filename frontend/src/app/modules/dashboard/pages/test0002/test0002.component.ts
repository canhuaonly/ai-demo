import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { Test0002Service } from './test0002.component.api';
import axios from "axios";
import { Observable } from "rxjs";

@Component({
    selector: 'app-podcast',
    templateUrl: './test0002.component.html',
    styleUrl: './test0002.component.css',
    standalone: true,
    imports: [
        FormsModule,
        MarkdownModule
    ],
})

export class Test0002Component implements OnInit {

    @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined;

    // 最近联系人列表
    userNm: string = ''
    contactsList: Array<any> = []
    // 发送消息
    sendInput: string = ''
    // 聊天内容
    messageList: Array<any> = []

    constructor(private service: Test0002Service) { }

    // 初期化
    ngOnInit() {
        if (window) {
            this.getData();
        }
    }

    // 视图组装完成后触发
    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    // TODO:要删除
    getData1(): string {
        this.sendInput = 'aaa'
        return 'ccc'
    }

    // 初期数据取得
    async getData() {
        // 获取当前用户
        this.service.getUser().then(res => {
            console.log(res);
            this.userNm = res[0].user_nm
        });

        // 获取最近联系人
        this.service.getContactsList().then(res => {
            console.log(res)
            this.contactsList = res
        });

        // 获取最近聊天内容
        this.service.getMessageList().then(res => {
            console.log(res)
            this.messageList = res
        });
    }

    // 发送消息
    async send() {

        if (this.isJapanese(this.sendInput) || !this.sendInput) {
            console.log('err');
            return
        }

        const entity = {
            user_cd: 'user',
            user_nm: 'Wang',
            message_order: 3,
            message: this.sendInput,
            wenxin_id: 0,
        }
        this.messageList.push(entity)
        this.sendInput = ''
        this.service.sendSingleMessage(entity).then(res => {
            console.log(res)
            if (res.status === '666') {
                // this.messageList.push(...reponse.entity)
                this.messageList.push(res.entity[1])
            }
            this.scrollToBottom();
        })
    }

    // 滚动
    scrollToBottom(): void {
        try {
          if (this.myScrollContainer) {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
          }
        } catch(err) { }
    }

    // 入力验证输入文字类型
    isJapanese(text: string): boolean {
        return /^[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]+$/.test(text);
    }

}