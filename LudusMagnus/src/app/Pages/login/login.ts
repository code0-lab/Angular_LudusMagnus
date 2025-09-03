import { Component, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class Login {

  email = '';
  password = '';
  remember = false;
  error = '';
  isLoading = false;
  showForgotPasswordMessage = false;
  showTestUsers = false; // test kullanıcısını göster gizle

  @ViewChild("emailRef")
  emailRef: ElementRef | undefined;

  @ViewChild("passwordRef")
  passwordRef: ElementRef | undefined;

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private cdr: ChangeDetectorRef
  ) { }

  /**
   * Handles user login using AuthService
   */
  userLogin() {
    if (!this.email || !this.password) {
      this.error = 'Email ve şifre alanları zorunludur';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.authService.login(this.email, this.password).subscribe({
      next: (success: boolean) => {
        this.isLoading = false;
        if (success) {
          console.log('Login başarılı');
          
          // Kullanıcının rolüne göre yönlendirme
          const user = this.authService.getCurrentUser();
          if (user) {
            switch (user.role) {
              case 'admin':
                this.router.navigate(['/admin']);
                break;
              case 'teacher':
                this.router.navigate(['/teacher-panel']);
                break;
              case 'student':
                this.router.navigate(['/cursus']);
                break;
              default:
                this.router.navigate(['/cursus']);
            }
          } else {
            this.router.navigate(['/cursus']);
          }
        } else {
          this.error = 'Email or password is incorrect';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Fail to login';
        console.error('Login hatası:', err);
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Toggles the forgot password message visibility
   */
  toggleForgotPasswordMessage(event: Event) {
    event.preventDefault();
    this.showForgotPasswordMessage = !this.showForgotPasswordMessage;
  }

  /**
   * Toggles the test users visibility
   */
  toggleTestUsers(event: Event) {
    event.preventDefault();
    this.showTestUsers = !this.showTestUsers;
  }

  /**
   * Form submit handler
   */
  onSubmit(event: Event) {
    event.preventDefault();
    this.userLogin();
  }
}



