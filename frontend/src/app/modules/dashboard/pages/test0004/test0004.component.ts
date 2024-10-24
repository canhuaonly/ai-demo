import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { HttpParam, MessageContent, RecentContacts, Test0004Service } from './test0004.component.api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-podcast',
  templateUrl: './test0004.component.html',
  styleUrl: './test0004.component.css',
  standalone: true,
  imports: [
    FormsModule
    , CommonModule
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
  current_user_nm: string = '';
  // 当前会话ID
  current_chat_id: string = '';
  // 当前登录用户的Key
  current_partition_key: string = '';
  // 上一次点击的index
  beforeIndex: number = -1;
  // 加载
  isLoading = false;

  constructor(private service: Test0004Service) { }

  // 初期化
  ngOnInit() {
    if (window) {
      this.getData();
    }
  }

  // 视图初始化完成后触发
  // ngAfterViewInit() {
  //   console.log(111);
  //   this.scrollToBottom();
  // }

  // 视图变更后触发
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  // 初期数据取得
  async getData() {

    const req: HttpParam = { data: 'wangtao', user: '', chatId: '' }

    // 获取当前用户
    this.service.getUser(req).subscribe(res => {
      this.userNm = res[0].userNm

      this.current_partition_key = res[0].partitionKey;

      // 获取最近联系人
      const contactReq: HttpParam = { data: '', user: res[0].partitionKey, chatId: '' }
      this.service.getContacts(contactReq).subscribe(res => {
        this.contactsList = res
      });
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

    this.isLoading = true;

    const req: HttpParam = { data: sendInput, user: this.current_user_id, chatId: this.current_chat_id }
    const entity: MessageContent = { chatId: '', message_q: sendInput, message_a: '' }
    this.messageList.push(entity)
    this.contactsList[this.beforeIndex].lastMsg = sendInput
    this.sendInput = ''
    this.service.sendSingleMessage(req).subscribe(res => {
      if (res.status === '666') {
        this.messageList[this.messageList.length - 1].chatId = res.entity.chatId
        this.messageList[this.messageList.length - 1].message_a = res.entity.message_a
        this.contactsList[this.beforeIndex].lastMsg = res.entity.message_a
      }
      this.scrollToBottom();
      this.isLoading = false;
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
    this.contactsList.splice(0, 0, 
      {
        'id': 'tempId',
        'userId': this.current_partition_key,
        'userNm': '',
        'lastMsg': '点击开始聊天'
      }
    );

    const element = document.getElementById("contactNm0") as HTMLInputElement
    if (element) {
      element.textContent = 'New Chat'
      element.contentEditable = 'true'
      element.focus()
    }
    console.log('New Chats');
  }

  // 切换会话
  changeTab(index: number) {

    console.log('切换会话' + index);

    const element = document.getElementById("contactNm" + index) as HTMLInputElement
    if (element) {
      if (element.contentEditable === 'true') return
    }

    // 上一次点击的元素背景色还原
    if (this.beforeIndex !== -1) {
      const beforeDiv = document.getElementById('contact' + this.beforeIndex);
      if (beforeDiv) {
        beforeDiv.classList.replace('bg-blue-100', 'bg-gray-100')
      }
    }

    // 当前点击的元素背景色设为蓝色
    const currentDiv = document.getElementById('contact' + index);
    if (currentDiv) {
      currentDiv.classList.replace('bg-gray-100', 'bg-blue-100')
    }

    // 保存点击的index
    this.beforeIndex = index

    // 点击的会话数据
    const currentData = this.contactsList[index]
    this.current_chat_id = currentData.id;
    this.current_user_id = currentData.userId;
    this.current_user_nm = currentData.userNm;

    // 获取最近聊天内容
    const req: HttpParam = { data: '', user: currentData.userId, chatId: currentData.id }
    this.service.getMessageList(req).subscribe(res => {
      this.messageList = res
    });
  }

  // 回车键发送消息
  sendOrLine(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // 阻止默认的Enter换行行为
      event.preventDefault();
      // Ctrl + Enter => 换行
      if (event.ctrlKey) {
        this.sendInput = this.sendInput + '\n';
      }
      // Enter => 发送消息  
      else {
        if (!this.isLoading) {
          this.send();
        }
      }
    }
  }

  // 修改会话名称
  editContactNm(index: number) {
    const element = document.getElementById("contactNm" + index) as HTMLInputElement
    if (element) {

      // 获取文字内容
      const textContent = element.innerText;

      if (element.contentEditable === 'true') {
        // 会话名称不可编辑

        element.contentEditable = 'false'

        if (this.contactsList[index].userNm === textContent) {
          console.log('会话名称没有变化，无需修改')
          return
        }

        // 调用后台API，更新会话名称
        const req: HttpParam = { data: textContent, user: this.contactsList[index].userId, chatId: this.contactsList[index].id }
        this.service.updateContactNm(req).subscribe(res => {
          if (res && (res.status === '666' || res.status === '777')) {
            console.log('会话名称修改成功：' + res.entity.userNm)
            this.contactsList[index].id = res.entity.id
            this.contactsList[index].userId = res.entity.userId
            this.contactsList[index].userNm = res.entity.userNm
            this.changeTab(index)
            this.current_chat_id = res.entity.id
            this.current_user_id = res.entity.userId
            this.current_user_nm = res.entity.userNm
          } else {
            console.log('失败了：' + res)
          }
        });

      } else {
        // 会话名称可编辑

        element.contentEditable = 'true'
        element.focus()
      }
    }
  }
}