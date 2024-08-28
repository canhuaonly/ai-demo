import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { Test0002Service } from './test0002.component.api';
import axios from "axios";

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
    userNm: string = 'fff'
    contactsList: Array<any> = [
        {
            contactNm: 'aaa',
            lastMsg: 'bbb'
        },
        {
            contactNm: 'ccc',
            lastMsg: 'ddd'
        },
    ]
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

    // 初期数据取得
    async getData() {
        // 获取当前用户
        this.service.getUser().subscribe({
            next: res => {
                this.userNm = res[0].user_nm
            },
            error: err => console.error('err: ' + JSON.stringify(err))
        });

        // 获取最近联系人
        this.service.getContactsList().subscribe({
            next: res => {
                this.contactsList = res
            },
            error: err => console.error('err: ' + JSON.stringify(err))
        });

        // 获取最近聊天内容
        this.service.getMessageList().subscribe({
            next: res => {
                this.messageList = res
            },
            error: err => console.error('err: ' + JSON.stringify(err))
        });
    }

    // 发送消息
    send() {
        const entity = {
            user_cd: 'user',
            user_nm: 'Wang',
            order: 3,
            message: this.sendInput,
            wenxin_id: 0,
        }
        this.messageList.push(entity)
        this.sendInput = ''
        this.service.sendSingleMessage(entity).subscribe(reponse => {
            console.log(reponse)
            if (reponse.status === '666') {
                // this.messageList.push(...reponse.entity)
                this.messageList.push(reponse.entity[1])
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
}