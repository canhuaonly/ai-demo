import { Component, ViewChild, ElementRef } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { Observable, catchError } from "rxjs";
import { MarkdownModule } from 'ngx-markdown';

@Component({
    selector: 'app-podcast',
    templateUrl: './test0002.html',
    styleUrl: './test0002.css',
    standalone: true,
    imports: [
        FormsModule,
        MarkdownModule
    ],
})

export class Test0002Component {

    @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined;

    sendInput: string = ''
    messageList: Array<any> = []

    constructor(private http: HttpClient) { 
        if (window) {
            this.getData().subscribe(reponse => {
                this.messageList = reponse
            })
        }
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

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
        this.sendSingleMessage(entity).subscribe(reponse => {
            console.log(reponse)
            if (reponse.status === '666') {
                // this.messageList.push(...reponse.entity)
                this.messageList.push(reponse.entity[1])
            }
            this.scrollToBottom();
        })
    }
    
    getData(): Observable<any> {
        // return this.http.get<any>('http://127.0.0.1:8000/getLyric/aaa')
        return this.http.get<any>('/api/ai/wenxin')
        
    }
    
    sendMessage(): Observable<any> {
        return this.http.post<any>('/api/ai/sendMessage', this.messageList)
    }
    
    sendSingleMessage(entity: any): Observable<any> {
        return this.http.post<any>('/api/ai/sendMessage', entity)
    }

    scrollToBottom(): void {
        try {
          if (this.myScrollContainer) {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
          }
        } catch(err) { }
    }
}