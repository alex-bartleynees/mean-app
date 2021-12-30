import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostsRoutingModule } from './posts-routing.module';

@NgModule({
  imports: [SharedModule, PostsRoutingModule],
  declarations: [PostCreateComponent, PostListComponent],
})
export class PostsModule {}
