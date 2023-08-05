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
    // Initialize states based on AuthService
    this.isLoggedIn = this.authService._isAuthenticated; // Assuming isAuthenticated() checks the token or user session
    this.username = this.authService.getUsername();  // Assuming getUsername() returns the username

    // Optionally, if your AuthService has an Observable for auth changes:
    this.authSubscription = this.authService.authChange.subscribe(isAuthenticated => {
      console.log('Authentication state changed to:', isAuthenticated);
      this.isLoggedIn = isAuthenticated;
      if (isAuthenticated) {
        this.username = this.authService.getUsername();
      } else {
        this.username = '';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
  }

  ngOnDestroy(): void {
    // Clean up the subscription when the component gets destroyed
    this.authSubscription?.unsubscribe();
  }

  showRegistrationForm(): void {
    this.showRegistration = true;
  }

  showLoginForm(): void {
    this.showRegistration = false;
  }
}
