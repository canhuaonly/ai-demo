import { Component, ViewChild, ElementRef, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import markdownIt from 'markdown-it';
import { Contacts, HttpParam, Messages, SendParam, Test0005Service } from './test0005.component.api';
import { RepeatPipe } from '../../../../core/utils/markdown.pipe';
import { interval, map } from "rxjs";
import { HttpClient, HttpDownloadProgressEvent, HttpEvent } from "@angular/common/http";


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
  // 当前选择的会话的index
  current_selected_index: number = -1;
  // 上一次点击的index
  beforeIndex: number = -1;
  // 加载
  isLoading = false;
  isScrollBottom = false

  constructor(private service: Test0005Service, private pipe: RepeatPipe, private http: HttpClient) { }

  // 初期化
  ngOnInit() {
    if (window) {
      this.getData();
    }
  }

  // // 视图初始化完成后触发
  // ngAfterViewInit() { }

  // 视图变更后触发
  ngAfterViewChecked() {
    if (this.isScrollBottom) {
      this.scrollToBottom();
      this.isScrollBottom = false
    }
  }

  // 初期数据取得
  async getData() {

    // // 订阅发布主逻辑
    // const observer1 = new concrete_observer("小明");
    // const observer2 = new concrete_observer("小强");
    // const observer3 = new concrete_observer("小红");
    // const subject_gupiao = new concrete_subject_gupiao("股票");
    // const subject_nba = new concrete_subject_nba("NBA");
    // console.log("小明订阅了股票");
    // subject_gupiao.subscribe(observer1);
    // console.log("小明订阅了NBA");
    // subject_nba.subscribe(observer1);
    // console.log("小强订阅了股票");
    // subject_gupiao.subscribe(observer2);
    // console.log("小红订阅了NBA");
    // subject_nba.subscribe(observer3);
    // console.log("---------------------------------");
    // subject_gupiao.update_message("大盘下跌");
    // subject_nba.update_message("骑士总冠军");
    // console.log("---------------------------------");
    // subject_gupiao.publish();
    // console.log("---------------------------------");
    // subject_nba.publish();
    // console.log("---------------------------------");
    // console.log("小明取消订阅股票");
    // subject_gupiao.unsubscribe(observer1);
    // console.log("小明取消订阅NBA");
    // subject_nba.unsubscribe(observer1);
    // console.log("---------------------------------");
    // subject_gupiao.update_message("大盘上涨");
    // subject_nba.update_message("骑士蝉联总冠军");
    // console.log("---------------------------------");
    // subject_gupiao.publish();
    // console.log("---------------------------------");
    // subject_nba.publish();
    // console.log("---------------------------------");

    /*------------------------------------*/

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

    this.current_selected_index = index;

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

      this.isScrollBottom = true
    });
  }

  // 发送消息
  // async send() {

  //   let sendInput = '';

  //   const sendInputElement = document.getElementById('sendInput') as HTMLInputElement;
  //   sendInput = sendInputElement && sendInputElement.value ? sendInputElement.value : this.sendInput;

  //   if (this.isJapanese(sendInput) || !sendInput) {
  //     console.log('err: 只接受简体中文或英文字母');
  //     return
  //   }

  //   this.isLoading = true;

  //   const req: HttpParam = { data: sendInput, user: this.current_user_id, chat_id: this.current_chat_id }
  //   const entity: Messages = { chat_id: '', message_q: sendInput, message_a: '', del_flg: '0'}
  //   this.messageList.push(entity)
  //   this.contactsList[this.beforeIndex].last_msg = sendInput
  //   this.sendInput = ''
  //   this.service.sendSingleMessage(req).subscribe(res => {
  //     if (res.status === '666') {
  //       this.messageList[this.messageList.length - 1].chat_id = res.entity.id
  //       this.messageList[this.messageList.length - 1].message_a = res.entity.last_msg
  //       this.contactsList[this.beforeIndex].last_msg = res.entity.last_msg
  //     }
  //     this.scrollToBottom();
  //     this.isLoading = false;
  //   })
  // }

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
        if (!this.isLoading && this.sendInput) {
          this.temp_send();
        }
      }
    }
  }

  // ----------------------------------------------------------------------------------------------

  message_a_innerHTML = "";
  current_message_a = "";

  // 创建监听器实例对象
  controller = new AbortController();

  temp_send() {
    
    this.message_a_innerHTML = "";
    this.current_message_a = "";
    
    this.isLoading = true;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this

    // 获取画面输入框
    let inputValue = '';
    const sendInputElement = document.getElementById('sendInput') as HTMLInputElement;
    inputValue = sendInputElement && sendInputElement.value ? sendInputElement.value : this.sendInput;

    /**
     * Request Param:
     *   data: question
     *   user: user id
     *   chat_id: chat id
     */
    const req: HttpParam = { data: inputValue, user: this.current_user_id, chat_id: this.current_chat_id}

    // 画面的消息列表追加1条（问题）
    const entity: Messages = { chat_id: '', message_q: inputValue, message_a: '', del_flg: '0'}
    this.messageList.push(entity)

    this.isScrollBottom = true

    // 画面输入框内容清空
    this.sendInput = ''

    // 从AbortController导出signal对象
    const { signal } = this.controller;

    // 调用服务端的流式接口
    this.service.sendMessageStream(req, signal).then(response => {

      console.log('全部返回值:' + response);
      return response.body;
    }).then(body => {

      const md = markdownIt();

      if (body) {
        const reader = body.getReader();
        const decoder = new TextDecoder();
        async function read() {
          const { done, value } = await reader.read();
          if (done) {
            // 读取完成
            console.log('读取完成')

            // 登陆数据
            that.send_update(that.current_message_a)
            return;
          }

          // 解码
          const data = decoder.decode(value, { stream: true });
          console.log("data:" + data)
          // if (data) {
            // JSON转换
            const json_data = JSON.parse(data).result || ''
            // 设定到当前流式传输的回答（无Markdown格式）
            that.current_message_a += json_data;
            // 将解码后的值转成Markdown格式
            const md_data = md.render(that.current_message_a)
            // markdown格式的数据再利用管道继续转换
            const pipe_data = that.pipe.transform(md_data) || '';
            // 设定到当前流式传输的回答（Markdown格式）
            that.message_a_innerHTML = pipe_data;
            // console.log("Answer 转换前:" + json_data)
            // console.log("Answer 转换后:" + pipe_data)
            // console.log("Answer 当前值:" + that.message_a_innerHTML)
            // 将解码后的值赋值到画面
            const sendInputElement = document.getElementById(`${'message_a'}${that.messageList.length - 1}`) as HTMLInputElement;
            sendInputElement.innerHTML = that.message_a_innerHTML
            that.contactsList[that.current_selected_index].last_msg = that.current_message_a

            // 滚动到底部
            that.isScrollBottom = true
          // }
          return read();
        }
        return read();
      } else {
        return Promise.resolve(null);
      }
    }).catch(error => {
      if (error.name === 'AbortError') {
        // 手动中断流
        console.log('abort message:', error.message);
      } else {
        // 处理其他类型的异常
        console.error('发生错误:', error);
      }
    });
  }

  // 中止
  abort() {
    console.log('Abort.');
    this.controller.abort();
    this.controller = new AbortController();
    this.send_update(this.current_message_a)
  }

  // 送信完成后登录/更新数据
  send_update(message_a: string) {

    const req: SendParam = { message_q: this.messageList[this.messageList.length - 1].message_q, message_a: message_a, user_id: this.current_user_id, chat_id: this.current_chat_id}
    console.log('Processing complete:', req);

    // 更新
    this.service.updateSend(req).subscribe(res => {
      if (res.status === '666') {
        this.messageList[this.messageList.length - 1].chat_id = res.entity.id
        this.contactsList[this.beforeIndex].last_msg = res.entity.last_msg
      }
      this.isLoading = false;
      console.log('Update complete:', res);
    })
  }

  // char_index = 0
  // type() {
  //   const enableCursor = false;  // 启用光标效果
  //   if (this.char_index < this.text.length) {

  //     const sendInputElement = document.getElementById('answer') as HTMLInputElement;
  //     const txt = sendInputElement && sendInputElement.value ? sendInputElement.value : this.sendInput;

  //     const cursor = enableCursor ? "|" : "";
  //     if (enableCursor && txt.endsWith("|")) {
  //       txt = txt.slice(0, -1);
  //     }

  //     const sendInputElement1 = document.getElementById('answer') as HTMLInputElement;
  //     sendInputElement1.value = txt + this.message_a_innerHTML.charAt(this.char_index);
  //     this.char_index++;
  //     setTimeout(this.type, 20);  // 打字机速度控制, 每秒5个字
  //   }
  // }
  
  
  inputStreamData = [1];
  outputStreamData: number[] = [];
  temp_send2() {
    interval(1500).pipe(
      map(output => {
        console.log('output:', output)
        return output % this.inputStreamData.length
      }),
      map(index => {
        return this.inputStreamData[index]
      })
    ).subscribe(element => {
      this.outputStreamData.push(element);
      console.log('444', this.outputStreamData)
    });
  }



  temp_send3() {

    console.log('Processing Start')

    const entity: HttpParam = {
      data: "Angular的订阅模式是什么",
      user: "user1",
      chat_id: "dcf071ee-d13c-4f4c-93ee-17fd170b6334"
    }

    // this.http.post('/api/cosmos_api/test0005/send_message_stream', entity, {observe: 'body', responseType: 'text'})

    let streamMessage: string = '';
    let chunkMessage: string = '';
    let beforeMessageLength: number = 0;


    this.http.post(
      '/api/cosmos_api/test0005/send_message_stream',
      entity,
      {observe: 'events', responseType: 'text', reportProgress: true}
    ).subscribe({
      next(event: HttpEvent<string>) {
        // console.log('data:', event)

        // console.log('event.type:', event.type)
        streamMessage = (event as HttpDownloadProgressEvent).partialText?.toString() || '';
        chunkMessage = streamMessage.slice(beforeMessageLength);
        beforeMessageLength = streamMessage.length;

        if (chunkMessage !== '') {

          const json_data = JSON.parse(chunkMessage).result || ''
          console.log('current data:', json_data)

        } else {
          // console.log('current data:', null)
        }
      },
      error(err) {
        console.log('Processing Error:', err)
      },
      complete() {
        console.log('Processing Complete')
      }
    })
  }
}