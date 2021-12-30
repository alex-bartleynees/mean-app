import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  subscription: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.subscription = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = authStatus;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }
}
