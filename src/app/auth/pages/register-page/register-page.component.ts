import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
})
export default class RegisterPageComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  errorMessages = signal<string[]>([]);

  registerForm = this.fb.group({
    fullName: [''],
    email: [''],
    password: [''],
  });

  onSubmit() {
    const {
      fullName = '',
      email = '',
      password = '',
    } = this.registerForm.value;

    return this.authService
      .register(fullName!, email!, password!)
      .subscribe((result) => {
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
