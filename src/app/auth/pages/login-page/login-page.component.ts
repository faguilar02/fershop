import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export default class LoginPageComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  errorMessages = signal<string[]>([]);
  isPosting = signal(false);

  loginForm = this.fb.group({
    email: [''],
    password: [''],
  });

  onSubmit() {
    const { email = '', password = '' } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe((result) => {
      if (result.success) {
        this.router.navigateByUrl('/');
        return;
      }

      this.errorMessages.set(result.errors || ['Error desconocido']);
      setTimeout(() => {
        this.errorMessages.set([]);
      }, 5000);
    });
  }
}
