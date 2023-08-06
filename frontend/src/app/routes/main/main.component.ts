import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'] // or .scss if you used that
})
export class MainComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  showRegistration = false;
  username: string = '';
  private authSubscription?: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.authChange.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        // Retrieve the username when logged in
        const username = this.authService.getUsername();
        this.username = username ? username : 'Unknown user'; // Provide a default value if username is null
      }
    });
  }
  login(username: string, password: string): void {
    this.authService.login(username, password).subscribe(response => {
      this.username = response.username;
      this.isLoggedIn = true;
    }, error => {
      // Handle login failure
    });
  }
  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.username = '';
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  showRegistrationForm(): void {
    this.showRegistration = true;
  }

  showLoginForm(): void {
    this.showRegistration = false;
  }
}
