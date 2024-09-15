import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { Contacts, MessageContent, Test0002Service } from './test0002.component.api';
import { of } from 'rxjs';

@Component({
  selector: 'app-podcast',
  templateUrl: './test0002.component.html',
  styleUrl: './test0002.component.css',
  standalone: true,
  imports: [
    FormsModule,
  ],
})

export class Test0002Component implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined;

  // 最近联系人列表
  userNm: string = ''
  contactsList: Array<Contacts> = []
  // 发送消息
  sendInput: string = ''
  // 聊天内容
  messageList: Array<MessageContent> = []

  constructor(private service: Test0002Service) { }

  // 初期化
  ngOnInit() {
    const aaa = of('data');
    aaa.subscribe(next => {
      console.log('xxxxxxxxx');
      console.log(next);
    })
    console.log(aaa)
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

    this.service.getUser().subscribe(res => {
      this.userNm = res[0].user_nm
    });

    // 获取最近联系人
    this.service.getContactsList().subscribe(res => {
      console.log(res)
      this.contactsList = res
    });

    // 获取最近聊天内容
    this.service.getMessageList().subscribe(res => {
      console.log(res)
      this.messageList = res
    });
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

    const entity: MessageContent = { user_cd: 'user', user_nm: 'Wang', message_order: 3, message: sendInput, wenxin_id: 0 }
    this.messageList.push(entity)
    this.sendInput = ''
    this.service.sendSingleMessage(entity).subscribe(res => {
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
    if (this.myScrollContainer) {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }
  }

  // 入力验证输入文字类型
  isJapanese(text: string): boolean {
    return /^[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]+$/.test(text);
  }

  // 创建新聊天
  async newChats() {
    const res = this.service.createNewChats(this.contactsList.length);
    this.contactsList.splice(0, 0, 
      {
        'user_session_aka': res.user_session_aka,
        'message': res.message
      }
    );
  }
}