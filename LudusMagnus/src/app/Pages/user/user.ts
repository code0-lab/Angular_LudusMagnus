import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IUser } from '../../models/IUser';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ICursus } from '../../models/ICursus';



@Component({
  selector: 'app-user',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User implements OnInit {
  activeSection: string = 'profile';
  currentUser: IUser | null = null;
  isLoading: boolean = true;
  cursusList: ICursus[] = [];
  savedCourses: ICursus[] = []; // Kaydedilmiş kursların detayları

  constructor(private api: Api, public authService: AuthService, private cd: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();
    
    if (user && user.id) {
      // API'den güncel kullanıcı bilgilerini çek
      this.api.getUser(+user.id).subscribe({
        next: (userData) => {
          this.currentUser = userData;
          this.loadSavedCourses(); // Kaydedilmiş kursları yükle
          this.isLoading = false;
          console.log('Kullanıcı bilgileri yüklendi:', userData);
          this.cd.detectChanges();
        },
        error: (error) => {
          console.error('Kullanıcı bilgileri yüklenirken hata:', error);
          this.currentUser = user; // Fallback olarak AuthService'den gelen veriyi kullan
          this.isLoading = false;
        }
      });
    } else {
      console.error('Kullanıcı giriş yapmamış');
      this.isLoading = false;
      this.router.navigate(['/unauthorized']);
    }
  }

  // Kaydedilmiş kursların detaylarını yükle
  loadSavedCourses(): void {
    if (this.currentUser?.savedCourses && this.currentUser.savedCourses.length > 0) {
      this.savedCourses = [];
      
      // Her kurs ID'si için kurs detaylarını çek
      this.currentUser.savedCourses.forEach(courseId => {
        this.api.getCursusById(courseId).subscribe({
          next: (course) => {
            this.savedCourses.push(course);
            this.cd.detectChanges();
          },
          error: (error) => {
            console.error(`Kurs ${courseId} yüklenirken hata:`, error);
          }
        });
      });
    }
  }

  // Kurs detay sayfasına git
  navigateToCourseDetail(courseId: string): void {
    this.router.navigate(['/course-details', courseId]);
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  // Form işlemleri için metodlar
  updateProfile(formData: any): void {
    if (this.currentUser && this.currentUser.id) {
      const updatedUser = { ...this.currentUser, ...formData };
      
      this.api.updateUser(this.currentUser.id.toString(), updatedUser).subscribe({
        next: (response) => {
          this.currentUser = response;
          console.log('Profil güncellendi:', response);
          alert('Profil başarıyla güncellendi!');
        },
        error: (error) => {
          console.error('Profil güncellenirken hata:', error);
          alert('Profil güncellenirken hata oluştu!');
        }
      });
    }
  }

  changePassword(currentPassword: string, newPassword: string): void {
    // Şifre değiştirme işlemi
    console.log('Şifre değiştirme işlemi:', { currentPassword, newPassword });
    // Bu kısım AuthService'de implement edilmeli
    alert('Şifre değiştirme özelliği yakında eklenecek!');
  }

  updatePrivacySettings(settings: any): void {
    // Gizlilik ayarları güncelleme
    console.log('Gizlilik ayarları:', settings);
    alert('Gizlilik ayarları güncellendi!');
  }

  updateNotificationSettings(settings: any): void {
    // Bildirim ayarları güncelleme
    console.log('Bildirim ayarları:', settings);
    alert('Bildirim ayarları güncellendi!');
  }

  getUserInitial(): string {
    if (this.currentUser?.name) {
      return this.currentUser.name.charAt(0).toUpperCase();
    }
    return 'U';
  }

  getUserName(): string {
    return this.currentUser?.name || 'Kullanıcı';
  }

  getUserEmail(): string {
    return this.currentUser?.email || 'user@example.com';
  }
}
