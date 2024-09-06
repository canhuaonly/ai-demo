import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { HttpParam, MessageContent, RecentContacts, Test0004Service } from './test0004.component.api';

@Component({
  selector: 'app-podcast',
  templateUrl: './test0004.component.html',
  styleUrl: './test0004.component.css',
  standalone: true,
  imports: [
    FormsModule,
    MarkdownModule
  ],
})

export class Test0004Component implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined;

  // 最近联系人列表
  userNm: string = ''
  contactsList: Array<RecentContacts> = []
  // 发送消息
  sendInput: string = ''
  // 聊天内容
  messageList: Array<MessageContent> = []
  // 当前用户
  current_user_id: string = '';
  // 当前会话ID
  current_chat_id: string = '';
  // 上一次点击的index
  beforeIndex: number = -1;

  constructor(private service: Test0004Service) { }

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

    const req: HttpParam = { data: 'wangtao', user: '', chatId: '' }

    // 获取当前用户
    this.service.getUser(req).then(res => {
      console.log(res);
      this.userNm = res[0].userNm
    });

    // 获取最近联系人
    this.service.getContacts(req).then(res => {
      console.log(res);
      this.contactsList = res
    });
    
    // const messageReq: HttpParam = { data: 'user01_1' }
    // // 获取最近聊天内容
    // this.service.getMessageList(messageReq).then(res => {
    //   console.log(res)
    //   this.messageList = res
    // });
  }

  // 发送消息
  async send() {

    let sendInput = '';

    const sendInputElement = document.getElementById('sendInput') as HTMLInputElement;
    sendInput = sendInputElement && sendInputElement.value ? sendInputElement.value : this.sendInput;

    if (this.isJapanese(sendInput) || !sendInput) {
      console.log('err: 只接受简体中文或英文字母');
      return
    }

    const req: HttpParam = { data: sendInput, user: this.current_user_id, chatId: this.current_chat_id }
    const entity: MessageContent = { chatId: '', message_q: sendInput, message_a: '' }
    this.messageList.push(entity)
    this.sendInput = ''
    this.service.sendSingleMessage(req).then(res => {
      console.log(res)
      if (res.status === '666') {
        this.messageList[this.messageList.length - 1].chatId = res.entity.message_a
        this.messageList[this.messageList.length - 1].message_a = res.entity.message_a
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
    } catch (err) {
      console.log(err)
    }
  }

  // 入力验证输入文字类型
  isJapanese(text: string): boolean {
    return /^[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]+$/.test(text);
  }

  // 创建新聊天
  async newChats() {
    // const res = this.service.createNewChats(this.contactsList.length);
    // this.contactsList.splice(0, 0, 
    //   {
    //     'user_cd': '',
    //     'user_nm': res.user_session_aka,
    //     'message_order': 0,
    //     'wenxin_id': 0,
    //     'message': res.message
    //   }
    // );
  }

  // 中断聊天
  interrupt() {
    console.log(777);
  }

  changeTab(index: number, chatId: string, userId: string) {

    if (this.beforeIndex !== -1) {
      const beforeDiv = document.getElementById('contact' + this.beforeIndex);
      if (beforeDiv) {
        beforeDiv.classList.replace('bg-blue-100', 'bg-gray-100')
      }
    }

    const currentDiv = document.getElementById('contact' + index);
    if (currentDiv) {
      currentDiv.classList.replace('bg-gray-100', 'bg-blue-100')
    }
    this.beforeIndex = index
    console.log(currentDiv);

    console.log(index)
    this.current_chat_id = chatId;
    this.current_user_id = userId;
    const req: HttpParam = { data: '', user: userId, chatId: chatId }
    // 获取最近聊天内容
    this.service.getMessageList(req).then(res => {
      console.log(res)
      this.messageList = res
    });
  }
}