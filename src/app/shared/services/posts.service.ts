import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../interfaces/post';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.httpClient
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxposts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxposts,
        });
      });
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image);

    this.httpClient
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClient.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>(`http://localhost:3000/api/posts/${id}`);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
      };
    }
    this.httpClient
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        (error) => {
          this.authService.authStatusListener.next(false);
        }
      );
  }

  deletePost(postId: string) {
    return this.httpClient.delete('http://localhost:3000/api/posts/' + postId);
  }
}