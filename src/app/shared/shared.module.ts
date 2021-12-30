import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorComponent } from './error/error.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  exports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule],
  entryComponents: [ErrorComponent],
})
export class SharedModule {}
