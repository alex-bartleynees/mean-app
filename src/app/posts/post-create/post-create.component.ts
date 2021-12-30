import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/interfaces/post';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PostsService } from 'src/app/shared/services/posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string | ArrayBuffer;
  private mode = 'create';
  private postId: string;
  private AuthStatusSub: Subscription;
  constructor(
    private postService: PostsService,
    private authService: AuthService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.AuthStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl('', { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.postId = paramMap.get('id');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: null,
          };
          this.imagePreview = this.post.imagePath;
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.AuthStatusSub.unsubscribe();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onAddPost() {
    if (!this.form.valid) {
      return;
    }

    this.isLoading = true;

    if (this.mode === 'edit') {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
      this.form.reset();
    }
  }
}
