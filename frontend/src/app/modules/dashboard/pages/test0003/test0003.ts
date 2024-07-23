import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from "rxjs";
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-podcast',
    templateUrl: './test0003.html',
    styleUrl: './test0003.css',
    standalone: true,
    imports: [
        RouterModule
        , FormsModule
        , CommonModule
        , HttpClientModule
    ],
})

export class Test0003Component implements OnInit {

    @ViewChild('aiBox') aiBox?: ElementRef<HTMLElement>;

  ques = "";

  isLoading = false;

  session_id = 'asfkYOIFYUOIyweorhgqqweroir';

  qaList: { role: string; content: string }[] = [];

  constructor(private http: HttpClient) { }

  

  sendOrLine(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // 阻止默认的Enter换行行为
      event.preventDefault();
      // Ctrl + Enter => 换行
      if (event.ctrlKey) {
        this.ques = this.ques + '\n';
      }
      // Enter => 发送消息  
      else {
        if (!this.isLoading) {
          this.wenxinChat();
        }
      }
    }
  }

  ngOnInit() {
    this.qaList = [];

    this.getQaListApi({ session_id: this.session_id }).subscribe({
      next: res => {
        this.qaList = res;
      },
      error: error => console.error(JSON.stringify(error)),
      complete: () => this.scrollToBottom()
    });
  }

  wenxinChat() {
    console.log(this.ques);
    this.isLoading = true; // 设置为等待状态
    let q = {
      role: 'user',
      content: this.ques
    }
    this.qaList.push(q);
    this.scrollToBottom();
    let param = {
      session_id: this.session_id,
      content: this.ques,
      qa_list: this.qaList
    }
    this.ques = '';
    this.wenxinApi(param).pipe(
      finalize(() => {
        this.isLoading = false; // 无论成功还是失败，都会在这里设置isLoading为false  
      })
    ).subscribe({
      next: res => {
        let a = {
          role: 'assistant',
          content: res
        }
        this.qaList.push(a);
        this.scrollToBottom();
      },
      error: error => console.error(JSON.stringify(error)),
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.aiBox) { // 检查属性是否被赋值  
        const scrollBox = this.aiBox.nativeElement;
        scrollBox.scrollTop = scrollBox.scrollHeight; // 滚动到底部  
      }
    }, 1);
  }

  wenxinApi(query: any): Observable<any> {
    return this.http.post('/api/dialogue_ctx/wenxin_api', query);
  }

  getQaListApi(query: any): Observable<any> {
    return this.http.post('/api/dialogue_ctx/get_qa_list', query);
  }
}