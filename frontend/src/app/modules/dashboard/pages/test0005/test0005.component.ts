import { Component, ViewChild, ElementRef, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import markdownIt from 'markdown-it';
import { Contacts, HttpParam, Messages, Test0005Service } from './test0005.component.api';
import { RepeatPipe } from '../../../../../../markdown.pipe';

@Component({
  selector: 'app-podcast',
  templateUrl: './test0005.component.html',
  styleUrls: ['./test0005.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    FormsModule
    , CommonModule
    , RepeatPipe
  ],
})

export class Test0005Component implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined;

  // 最近联系人列表
  userNm: string = ''
  contactsList: Array<Contacts> = []
  // 发送消息
  sendInput: string = ''
  // 聊天内容
  messageList: Array<Messages> = []
  // 当前用户
  current_user_id: string = '';
  current_contact_nm: string = '';
  // 当前会话ID
  current_chat_id: string = '';
  // 当前登录用户的Key
  current_partition_key: string = '';
  // 当前画面最大的Message条数
  current_message_index: number = -1;
  // 上一次点击的index
  beforeIndex: number = -1;
  // 加载
  isLoading = false;

  constructor(private service: Test0005Service, private pipe: RepeatPipe) { }

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
    console.log(222);
    this.scrollToBottom();
  }

  // 初期数据取得
  async getData() {

    const req: HttpParam = { data: 'wangtao', user: '', chat_id: '' }

    // 获取当前用户
    this.service.getUser(req).subscribe(res => {
      this.userNm = res[0].userNm

      this.current_partition_key = res[0].partitionKey;

      // 获取最近联系人
      const contactReq: HttpParam = { data: '', user: res[0].partitionKey, chat_id: '' }
      this.service.getContacts(contactReq).subscribe(res => {
        this.contactsList = res
      });
    });
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

        if (this.contactsList[index].contact_nm === textContent) {
          console.log('会话名称没有变化，无需修改')
          return
        }

        // 调用后台API，更新会话名称
        const req: HttpParam = { data: textContent, user: this.contactsList[index].user_id, chat_id: this.contactsList[index].id }
        this.service.updateContactNm(req).subscribe(res => {
          if (res && (res.status === '666' || res.status === '777')) {
            console.log('会话名称修改成功：' + res.entity.contact_nm)
            this.contactsList[index].id = res.entity.id
            this.contactsList[index].user_id = res.entity.user_id
            this.contactsList[index].contact_nm = res.entity.contact_nm
            this.changeTab(index)
            this.current_chat_id = res.entity.id
            this.current_user_id = res.entity.user_id
            this.current_contact_nm = res.entity.contact_nm
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
    this.current_user_id = currentData.user_id;
    this.current_contact_nm = currentData.contact_nm;

    // 获取最近聊天内容
    const req: HttpParam = { data: '', user: currentData.user_id, chat_id: currentData.id }
    this.service.getMessageList(req).subscribe(res => {
      this.messageList = res

      const md = markdownIt();
      this.current_message_index = this.messageList.length - 1;
      for (let i = 0; i < this.messageList.length; i++) {
        if (this.messageList[i].message_q) {
          const message_q = md.render(this.messageList[i].message_q)
          this.messageList[i].message_q = message_q
        }
        if (this.messageList[i].message_a) {
          const message_a = md.render(this.messageList[i].message_a)
          this.messageList[i].message_a = message_a
        }
      }
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

    const req: HttpParam = { data: sendInput, user: this.current_user_id, chat_id: this.current_chat_id }
    const entity: Messages = { chat_id: '', message_q: sendInput, message_a: '', del_flg: '0'}
    this.messageList.push(entity)
    this.contactsList[this.beforeIndex].last_msg = sendInput
    this.sendInput = ''
    this.service.sendSingleMessage(req).subscribe(res => {
      if (res.status === '666') {
        this.messageList[this.messageList.length - 1].chat_id = res.entity.id
        this.messageList[this.messageList.length - 1].message_a = res.entity.last_msg
        this.contactsList[this.beforeIndex].last_msg = res.entity.last_msg
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
        'user_id': this.current_partition_key,
        'contact_nm': '',
        'last_msg': '点击开始聊天',
        'del_flg': '0'
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

  // ----------------------------------------------------------------------------------------------

  current_text = document.getElementById('answer');
  text = "";
  char_index = 0

  temp_send() {
    
    this.text = "";

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this

    let inputValue = '';

    const sendInputElement = document.getElementById('sendInput') as HTMLInputElement;
    inputValue = sendInputElement && sendInputElement.value ? sendInputElement.value : this.sendInput;

    const req: HttpParam = { data: inputValue, user: this.current_user_id, chat_id: this.current_chat_id}

    const entity: Messages = { chat_id: '', message_q: inputValue, message_a: '', del_flg: '0'}
    this.messageList.push(entity)

    // 调用服务端的流式接口, 修改为自己的服务器地址和端口号
    this.service.sendMessageStream(req).then(response => {
      return response.body;
    }).then(body => {

      const md = markdownIt();

      if (body) {
        const reader = body.getReader();
        const decoder = new TextDecoder();
        async function read(): Promise<unknown> {
          const { done, value } = await reader.read();
          if (done) { // 读取完成
            return;
          }
          const data = decoder.decode(value, { stream: true });
          // console.log("text：" + that.text)
          console.log("数据：" + data)
          console.log("数据1：" + JSON.parse(data))
          console.log("数据2：" + JSON.parse(data).result)
          let cunrrent_str = JSON.parse(data).result || '';
          if (cunrrent_str !== '') {
            cunrrent_str = md.render(cunrrent_str)
          }
          that.text += cunrrent_str || '';
          // that.type(); // 打字机效果输出

          // const sendInputElement = document.getElementById(`${'message_a'}${that.messageList.length - 1}`) as HTMLInputElement;
          // const txt = sendInputElement && sendInputElement.value ? sendInputElement.value : '';

          // const pipe = new RepeatPipe();

          const sendInputElement = document.getElementById(`${'message_a'}${that.messageList.length - 1}`) as HTMLInputElement;
          sendInputElement.innerHTML = that.pipe.transform(that.text);

          return read();
        }
        return read();
      } else {
        return Promise.resolve(null);
      }
    }).catch(error => {
      console.error('发生错误:', error);
    });
  }

  type() {
    // const enableCursor = false;  // 启用光标效果
    // if (this.char_index < this.text.length) {

      const sendInputElement = document.getElementById('answer') as HTMLInputElement;
      const txt = sendInputElement && sendInputElement.value ? sendInputElement.value : this.sendInput;

      // const cursor = enableCursor ? "|" : "";
      // if (enableCursor && txt.endsWith("|")) {
      //   txt = txt.slice(0, -1);
      // }

      const sendInputElement1 = document.getElementById('answer') as HTMLInputElement;
      sendInputElement1.value = txt + this.text.charAt(this.char_index);
      this.char_index++;
      // setTimeout(this.type, 20);  // 打字机速度控制, 每秒5个字
    // }
  }
}