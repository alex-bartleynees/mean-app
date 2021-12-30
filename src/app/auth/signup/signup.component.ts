import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  subscription: Subscription;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.subscription = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = authStatus
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}
