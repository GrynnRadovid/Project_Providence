import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm: FormGroup;  // Declared here
  error: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // Initialize loginForm inside the constructor
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe(
        response => {
          console.log(response);
          this.error = null;
        },
        err => {
          console.error(err);
          this.error = 'Invalid credentials. Please try again.';
        }
      );
    }
  }
}
