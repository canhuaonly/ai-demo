import { Component, OnInit } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { Test0001Service } from "./test0001.api";

@Component({
    selector: 'app-podcast',
    templateUrl: './test0001.html',
    styleUrl: './test0001.css',
    standalone: true,
    imports: [
        FormsModule,
    ],
})

export class Test0001Component implements OnInit {
    list1: Array<String> = []
    list2: Array<String> = []

    isPoetry1: boolean = true
    isPoetry2: boolean = false

    head = {
        text1: '你！来！过！年！华！被！传！说！',
        text2: 'xxx',
        text3: ''
    }

    constructor(private service: Test0001Service) {}

    ngOnInit() {
        this.list1 = [
            '苍！天！对！你！在！呼！唤！',
            '一！座！山！翻！过！一！条！河！',
            '千！山！万！水！永！不！寂！寞！'
        ]

        this.list2 = []
    }

    // getData(): Observable<any> {
    //     // return this.http.get<any>('http://127.0.0.1:8000/getLyric/aaa')
    //     return this.http.get<any>('/api/ai/getLyric/aaa')
        
    // }

    getNext() {
        // this.getData().subscribe({
        //     next: reponse => {
        //         console.log(reponse)
        //         this.isPoetry2 = true
        //         this.head.text2 = reponse.message
        //     },
        //     error: error => console.error(JSON.stringify(error)),
        //     complete: () => {

        //     }
        // })
        this.service.getData().subscribe({
            next: reponse => {
                console.log(reponse)
                this.isPoetry2 = true
                this.head.text2 = reponse.message

                return reponse.message
            },
            error: error => console.error(JSON.stringify(error)),
            complete: () => {

            }
        })

        return null
    }

    addLyric() {
        this.list2.push(this.head.text3)
        this.head.text3 = ''
    }

    sum(a: number, b: number) {
        return a + b;
    }
}

export function sum(a: number, b: number) {
    return a + b;
}