import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { AqviewService } from './aqview.api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aqview',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './aqview.component.html',
  styleUrl: './aqview.component.css'
})


export class AqviewComponent implements OnInit {

  @ViewChild('aiBox') aiBox?: ElementRef<HTMLElement>;

  ques = "";

  isLoading = false;

  session_id = 'asfkYOIFYUOIyweorhgqqweroir';

  qaList: { role: string; content: string }[] = [];

  constructor(private interfaceService: AqviewService) { }

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

    this.interfaceService.getQaListApi({ session_id: this.session_id }).subscribe({
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
    this.interfaceService.wenxinApi(param).pipe(
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

  test() {
    console.log(this.ques);
  }

  async onButtonClick() {
    this.isLoading = true; // 设置为等待状态  

    // 模拟异步操作  
    await new Promise(resolve => setTimeout(resolve, 2000));

    this.isLoading = false; // 异步操作完成后，恢复状态  
  }
}
