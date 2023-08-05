import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  error: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;

      this.authService.register(formData).subscribe({
        next: response => {
          console.log(response);
          // Handle success
          this.error = null; // Clear any existing error messages on success
        },
        error: err => {
          console.error(err);
          // Handle error
          this.error = err || "There was an error with registration. Please try again.";
        }
      });
    } else {
      this.error = "All fields are required!";
    }
  }
}
