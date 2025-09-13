import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  hasError = signal<boolean>(false);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(1)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.hasError.set(true);

      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);

      return;
    }

    const {
      fullName = '',
      email = '',
      password = '',
    } = this.registerForm.value;

    return this.authService
      .register(fullName!, email!, password!)
      .subscribe((isRegisterSuccess) => {
        if (isRegisterSuccess) {
          this.router.navigateByUrl('/');
          return;
        }

        this.hasError.set(true);

        setTimeout(() => {
          this.hasError.set(false);
        }, 2000);
      });
  }
}
