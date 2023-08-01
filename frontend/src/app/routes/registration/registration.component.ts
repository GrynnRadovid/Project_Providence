import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  error: string | null = null;

  constructor(private fb: FormBuilder, private registrationService: RegistrationService) {
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

      this.registrationService.register(formData).subscribe(
        response => {
          console.log(response);
          // Handle success
          this.error = null; // Clear any existing error messages on success
        },
        err => {
          console.error(err);
          // Handle error
          this.error = err || "There was an error with registration. Please try again.";
        }
      );
    } else {
      this.error = "All fields are required!";
    }
  }
}
