import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CosmosLearnV1Service } from './cosmos-learn-v1.api';

@Component({
  selector: 'cosmos-learn-v1',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cosmos-learn-v1.component.html',
  styleUrl: './cosmos-learn-v1.component.css'
})


export class CosmosLearnV1Component implements OnInit {

  constructor(private cosmosLearnV1Service: CosmosLearnV1Service) { }

  ngOnInit() {
    // this.init();
  }

  // [C1] 创建/编辑用户
  createUsers() {
    this.cosmosLearnV1Service.createUsers({}).subscribe({
      next: res => {
        console.log(res);
      },
      error: error => console.error(JSON.stringify(error))
    });
  }

  // [Q1] 检索用户
  searchUsers() {
    this.cosmosLearnV1Service.searchUsers({}).subscribe({
      next: res => {
        console.log(res);
      },
      error: error => console.error(JSON.stringify(error))
    });
  }

  // [C2] 创建/编辑帖子
  createPosts() {
    this.cosmosLearnV1Service.createPosts({}).subscribe({
      next: res => {
        console.log(res);
      },
      error: error => console.error(JSON.stringify(error))
    });
  }

  // [Q2] 检索帖子
  searchPosts() {
    this.cosmosLearnV1Service.searchPosts({}).subscribe({
      next: res => {
        console.log(res);
      },
      error: error => console.error(JSON.stringify(error))
    });
  }

  // [Q3] 以短格式列出用户的帖子
  searchUserPosts() {
    this.cosmosLearnV1Service.searchUserPosts({}).subscribe({
      next: res => {
        console.log(res);
      },
      error: error => console.error(JSON.stringify(error))
    });
  }

  // [C3] 创建评论
  createComments() {
    this.cosmosLearnV1Service.createComments({}).subscribe({
      next: res => {
        console.log(res);
      },
      error: error => console.error(JSON.stringify(error))
    });
  }

  // [Q4] 列出帖子的评论
  searchPostComments() {
    this.cosmosLearnV1Service.searchPostComments({}).subscribe({
      next: res => {
        console.log(res);
      },
      error: error => console.error(JSON.stringify(error))
    });
  }

  // [C4] 为帖子点赞
  createLikes() {
    this.cosmosLearnV1Service.createLikes({}).subscribe({
      next: res => {
        console.log(res);
      },
      error: error => console.error(JSON.stringify(error))
    });
  }

  // [Q5] 列出帖子的点赞数
  searchPostLikes() {
    this.cosmosLearnV1Service.searchPostLikes({}).subscribe({
      next: res => {
        console.log(res);
      },
      error: error => console.error(JSON.stringify(error))
    });
  }

  // [Q6] 以短格式列出最近创建的 x 个帖子（源）
  searchRecentPosts() {
    this.cosmosLearnV1Service.searchRecentPosts({}).subscribe({
      next: res => {
        console.log(res);
      },
      error: error => console.error(JSON.stringify(error))
    });
  }

  // searchUser1Posts
  searchUser1Posts() {
    this.cosmosLearnV1Service.searchUser1Posts({}).subscribe({
      next: res => {
        console.log(res);
      },
      error: error => console.error(JSON.stringify(error))
    });
  }

}
