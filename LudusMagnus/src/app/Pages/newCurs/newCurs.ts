import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Api } from '../../services/api';
import { ICursus } from '../../models/ICursus';
import { AuthService } from '../../services/auth.service';
import { TeacherGuard } from '../../guards/teacher.guard';

@Component({
  selector: 'app-new-curs',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './newCurs.html',
  styleUrl: './newCurs.css'
})
export class NewCurs implements OnInit {
  
  // Form modeli
  formModel = {
    id: '',
    title: '',
    description: '',
    duration: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    instructor: '',
    price: 0,
    category: '',
    rating: 0
  };

  isCreating: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(
    private api: Api,
    private router: Router,
    private authService: AuthService,
    private teacherGuard: TeacherGuard
  ) {}

  ngOnInit(): void {
    // Yetki kontrolü
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin')) {
      this.formModel.instructor = currentUser.name;
    }
    else {
      this.router.navigate(['/unauthorized']);
      alert('Only teachers and admins can create courses.');
    }
  }

  // Yeni kurs oluştur
  createNewCourse() {
    if (!this.validateForm()) {
      return;
    }

    this.isCreating = true;
    this.message = '';
    
    const newCourse: Omit<ICursus, 'id'> = {
      title: this.formModel.title,
      description: this.formModel.description,
      duration: this.formModel.duration,
      level: this.formModel.level,
      instructor: this.formModel.instructor,
      price: this.formModel.price,
      category: this.formModel.category,
      rating: this.formModel.rating,
      isActive: true,
      createdAt: new Date().toISOString(),
      enrolledStudents: 0
    };
    
    this.api.addCursus(newCourse as ICursus).subscribe({
      next: (addedCourse: ICursus) => {
        console.log('Yeni kurs oluşturuldu:', addedCourse);
        this.message = 'curs successfully created!';
        this.messageType = 'success';
        this.resetForm();
        this.isCreating = false;
        
        // 2 saniye sonra cursus sayfasına yönlendir
        setTimeout(() => {
          this.router.navigate(['/cursus']);
        }, 2000);
      },
      error: (error) => {
        console.error('Yeni kurs oluşturulurken hata oluştu:', error);
        this.message = 'Kurs oluşturulurken bir hata oluştu!';
        this.messageType = 'error';
        this.isCreating = false;
      }
    });
  }
  
  // Form doğrulama
  validateForm(): boolean {
    if (!this.formModel.title.trim()) {
      this.message = 'curs title is required!';
      this.messageType = 'error';
      return false;
    }
    if (!this.formModel.description.trim()) {
      this.message = 'curs description is required!';
      this.messageType = 'error';
      return false;
    }
    if (!this.formModel.instructor.trim()) {
      this.message = 'instructor is required!';
      this.messageType = 'error';
      return false;
    }
    if (this.formModel.price < 0) {
      this.message = 'price is required and must be positive!';
      this.messageType = 'error';
      return false;
    }
    return true;
  }
  
  // Form temizle
  resetForm() {
    this.formModel = {
      id: '',
      title: '',
      description: '',
      duration: '',
      level: 'beginner',
      instructor: '',
      price: 0,
      category: '',
      rating: 0
    };
  }

  // Geri dön
  goBack() {
    this.router.navigate(['/cursus']);
  }
}