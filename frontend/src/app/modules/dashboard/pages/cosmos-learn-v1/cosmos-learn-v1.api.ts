import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})

export class CosmosLearnV1Service {
 
  constructor(private http: HttpClient) { }
 
  // [C1] 创建/编辑用户
  createUsers(query: any): Observable<any> {
    return this.http.post('/api/cosmos_learn_v1/createUsers', query);
  }

  // [Q1] 检索用户
  searchUsers(query: any): Observable<any> {
    return this.http.post('/api/cosmos_learn_v1/searchUsers', query);
  }

  // [C2] 创建/编辑帖子
  createPosts(query: any): Observable<any> {
    return this.http.post('/api/cosmos_learn_v1/createPosts', query);
  }

  // [Q2] 检索帖子
  searchPosts(query: any): Observable<any> {
    return this.http.post('/api/cosmos_learn_v1/searchPosts', query);
  }

  // [Q3] 以短格式列出用户的帖子
  searchUserPosts(query: any): Observable<any> {
    return this.http.post('/api/cosmos_learn_v1/searchUserPosts', query);
  }

  // [C3] 创建评论
  createComments(query: any): Observable<any> {
    return this.http.post('/api/cosmos_learn_v1/createComments', query);
  }

  // [Q4] 列出帖子的评论
  searchPostComments(query: any): Observable<any> {
    return this.http.post('/api/cosmos_learn_v1/searchPostComments', query);
  }

  // [C4] 为帖子点赞
  createLikes(query: any): Observable<any> {
    return this.http.post('/api/cosmos_learn_v1/createLikes', query);
  }

  // [Q5] 列出帖子的点赞数
  searchPostLikes(query: any): Observable<any> {
    return this.http.post('/api/cosmos_learn_v1/searchPostLikes', query);
  }

  // [Q6] 以短格式列出最近创建的 x 个帖子（源）
  searchRecentPosts(query: any): Observable<any> {
    return this.http.post('/api/cosmos_learn_v1/searchRecentPosts', query);
  }

  // searchUser1Posts
  searchUser1Posts(query: any): Observable<any> {
    return this.http.post('/api/cosmos_learn_v1/searchUser1Posts', query);
  }
}