import { Component, ViewChild, ElementRef, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { chatUser, chatHistoryThread, chatHistoryFile, chatHistoryMessage, Test0006Service } from './test0006.component.api';
import { RepeatPipe } from 'src/app/core/utils/markdown.pipe';
import { AngularSvgIconModule } from 'angular-svg-icon';
import markdownIt from 'markdown-it';

@Component({
  selector: 'app-podcast',
  templateUrl: './test0006.component.html',
  styleUrls: ['./test0006.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    FormsModule
    , CommonModule
    , RepeatPipe
    , AngularSvgIconModule
  ],
})

export class Test0006Component implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined;

  /**
   * html元素
   */
  // 用户名
  user_nm: string = ''
  // 发送消息文本框
  question_input: string = ''
  // 会话列表
  threadList: Array<chatHistoryThread> = []
  // 消息列表
  message_list: Array<chatHistoryMessage> = []

  /**
   * 全局变量
   */
  // markdown渲染
  md = markdownIt();
  // 用户信息
  userInfo: chatUser = { user_id: '', user_nm: '' }
  // 原标题内容
  original_thread_title: string = ''
  // 选中的会话ID
  selected_thread_id: string = ''
  // 选中的会话名称
  selected_thread_title: string = ''
  // // 当前对话信息
  // current_message: chatHistoryMessage = { thread_id: '', message_question: '', message_answer: '' }
  // 中止控制器
  abortController = new AbortController();
  // 上一次点击的index
  beforeIndex: number = -1;
  // 发送中
  sending = false;
  // 滚动标记
  isScrollBottom = false;

  constructor(private service: Test0006Service, private pipe: RepeatPipe) { }

  // 初期化
  ngOnInit() {
    if (window) {
      this.getData();
    }
  }

  // 滚动
  scrollToBottom(): void {
    if (this.myScrollContainer) {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }
  }

  // 视图变更后触发
  ngAfterViewChecked() {
    if (this.isScrollBottom) {
      this.scrollToBottom();
      this.isScrollBottom = false
    }
  }

  // 初期数据取得
  async getData() {

    const paramUser: chatUser = { user_id: '15524085993', user_nm: '' }

    // 获取当前用户
    // 1.异步方式取得
    /*
    this.service.getUser(user).subscribe(res => {
      this.userInfo = user
    });
    */
    // 2.同步方式取得
    this.userInfo = await firstValueFrom(this.service.getUser(paramUser));  // 使用 firstValueFrom 处理 Observable

    // 获取Thrad列表
    this.threadList = await firstValueFrom(this.service.getThreadList(this.userInfo));  // 使用 firstValueFrom 处理 Observable
  }


  // 添加新聊天
  async addChat() {
    let newThread: chatHistoryThread = {
      'user_id': this.userInfo.user_id,
      'application_id': '',
      'user_application_id': '',
      'thread_id': '',
      'thread_title': 'New Chat',
      'last_question': '',
      'last_question_timestamp': new Date().getTime().toString(),
      'del_flg': '0',
    }
    newThread = await firstValueFrom(this.service.createThread(newThread));
    this.threadList.unshift(newThread);

  }

  avatarClick() {
    console.log(this.threadList)
  }

  // 发送消息
  send() {
    // 信息发送状态不做处理
    if (this.sending) {
      return;
    }
    // 当前对象储存
    const that = this
    // 消息发送中不可点击
    that.sending = true;
    // 异常状态
    let error = false;
    // 流文本信息清空
    let answer_stream = "";
    // 从AbortController导出signal对象
    const { signal } = that.abortController;
    // 当前会话信息设定
    let current_message: chatHistoryMessage = {
      thread_id: that.selected_thread_id,
      message_question: that.question_input,
      message_answer: '',
      question_timestamp: new Date().getTime().toString(),
      message_question_md: that.md.render(that.question_input),
    }
    // question清空
    that.question_input = "";
    // 消息列表添加当前提问
    that.message_list.push(current_message)
    // 最新消息更新
    that.threadList.forEach(item => {
      if (item.thread_id === that.selected_thread_id) {
        item.last_question = current_message.message_question
        item.last_question_timestamp = current_message.question_timestamp
      }
    })
    // 当前对话框置顶
    that.threadList.sort((a, b) => {
      return parseInt(b.last_question_timestamp || '0') - parseInt(a.last_question_timestamp || '0');
    })
    // 滚动到底部
    that.isScrollBottom = true;
    // 调用服务端的流式接口
    that.service.interactiveMessageStream(that.message_list, signal).then(res => {
      return res.body;
    }).then(body => {
      // 服务器返回的消息内容
      if (body) {
        // 读取器对象取得
        const reader = body.getReader();
        // 文本解码器对象取得
        const decoder = new TextDecoder();
        // 读取数据
        async function read(): Promise<void> {
          // 读取数据
          const { done, value } = await reader.read();
          // 读取完成
          if (done) {
            console.log('done读取完成');
            return;
          }
          // 流文本解码
          const data = decoder.decode(value, { stream: true });
          console.log('json data:', data);
          // 解析数据
          let text_data = JSON.parse(data).result || '';
          // 文本信息追加
          answer_stream += text_data || '';
          // markdow格式化
          const answer_md = that.md.render(answer_stream);
          // markdown格式的数据再利用管道继续转换
          const pipe_data = that.pipe.transform(answer_md) || '';
          // 文本信息显示到页面
          const sendInputElement = document.getElementById(`${'message_answer_md'}${that.message_list.length - 1}`) as HTMLInputElement;
          sendInputElement.innerHTML = pipe_data;
          // 滚动到底部
          that.isScrollBottom = true;
          // 继续读取数据
          return read();
        }
        // 读取数据
        return read();
      } else {
        return Promise.resolve(null);
      }
    }).catch(error => {
      if (error.name === 'AbortError') {
        // 中断
        console.error('中断回答');
      } else {
        // 处理其他类型的异常
        console.error('流文本读取失败:', error);
        // 异常状态
        error = true;
      }
    }).finally(() => {
      // 非异常状态才登录数据
      if (!error) {
        // 回答内容
        current_message.message_answer = answer_stream;
        // 回答时间
        current_message.answer_timestamp = new Date().getTime().toString();
        // 读取完成后登陆数据
        this.service.addHistoryMessage(current_message).subscribe(() => {
          console.log('保存消息成功。')
        })
      }
      // 滚动到底部
      that.isScrollBottom = true;
      // 接收完成, 按钮恢复可用
      that.sending = false;
    });
  }

  // 回车键发送消息
  sendOrLine(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // 阻止默认的Enter换行行为
      event.preventDefault();
      // Ctrl + Enter => 换行
      if (event.ctrlKey) {
        this.question_input = this.question_input + '\n';
      }
      // Enter => 发送消息  
      else {
        this.send();
      }
    }
  }

  // 切换会话
  changeTab(item: chatHistoryThread) {
    // 信息发送状态不做处理
    if (this.sending) {
      return;
    }
    // 取消选中其他会话
    const selectedItem = this.threadList.find(i => i.isSelected)
    if (selectedItem) {
      selectedItem.isSelected = false;
    }
    // 选中点击的会话数据
    item.isSelected = true;
    this.selected_thread_id = item.thread_id;
    this.selected_thread_title = item.thread_title || '';

    // 获取最近聊天内容
    const req: chatHistoryThread = { thread_id: this.selected_thread_id }
    this.service.getHistoryMessage(req).subscribe(res => {
      this.message_list = res

      // const md = markdownIt();
      for (let i = 0; i < this.message_list.length; i++) {
        if (this.message_list[i].message_question) {
          const question_md = this.md.render(this.message_list[i].message_question)
          this.message_list[i].message_question_md = question_md
        }
        if (this.message_list[i].message_answer) {
          const answer_md = this.md.render(this.message_list[i].message_answer)
          this.message_list[i].message_answer_md = answer_md
        }
      }
      this.isScrollBottom = true;
    });
  }

  // 编辑会话名称
  editThreadTitle(item: chatHistoryThread) {
    // 取消正在编辑的标题
    const ediableItem = this.threadList.find(i => i.isEditable)
    if (ediableItem) {
      this.cancelEdit(ediableItem)
    }
    // 源标题内容
    this.original_thread_title = item.thread_title || ''
    // 可编辑
    item.isEditable = true;
    // 元素取得
    if (item.id) {
      let el = document.getElementById(item.id) as HTMLInputElement
      // 获取焦点
      if (el) {
        el.focus()
      }
    }
  }

  // 删除会话
  deleteThread(item: chatHistoryThread, event: Event) {
    // 阻止事件冒泡
    event.stopPropagation();
    // 确认弹窗
    if (confirm('确认删除会话？')) {
      //如果山出的是当前选中的会话，则取消选中
      if (item.isSelected) {
        this.selected_thread_id = ''
        this.selected_thread_title = ''
      }
      // 会话列表删除
      this.threadList = this.threadList.filter(o => o.id !== item.id)
      // 逻辑删除会话
      this.service.deleteThread(item).subscribe(res => {
        // 删除成功弹窗
        alert('删除成功。')
      })
    }
  }

  // 保存会话名称
  saveThreadTitle(item: chatHistoryThread) {
    console.log('item.thread_title', item.thread_title)
    console.log('this.original_thread_title', this.original_thread_title)
    // 如果内容发生变化
    if (item.thread_title !== this.original_thread_title) {
      // 修改会话名称
      this.original_thread_title = item.thread_title || '';
      // 保存会话名称
      this.service.updateThreadTitle(item).subscribe(res => {
        item.isEditable = false;
      })
    } else {
      // 取消编辑
      item.isEditable = false;
    }
  }

  // 取消编辑
  cancelEdit(item: chatHistoryThread) {
    // 恢复原标题内容
    item.thread_title = this.original_thread_title
    // 取消编辑
    item.isEditable = false;
  }

  // 中止
  abort() {
    this.abortController.abort();
    this.abortController = new AbortController();
  }
}