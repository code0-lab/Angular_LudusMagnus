import { Component, ChangeDetectorRef } from '@angular/core';
import { Api } from '../../services/api';
import { ICursus, createEmptyCursus, CursusLevel, CATEGORY_OPTIONS } from '../../models/ICursus';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ValidCurs } from '../../Utils/validCurs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-curs',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './add-curs.html',
  styleUrl: './add-curs.css'
})
export class AddCurs {

  // Factory function kullanarak temiz kurs objesi oluştur
  newCurs: ICursus = createEmptyCursus();

  validCurs = new ValidCurs();
  validationErrors: string[] = [];
  isSubmitting = false;
  submitSuccess = false;

  // Enum'ları kullanarak seviye seçenekleri
  levelOptions = [
    { value: CursusLevel.BEGINNER, label: 'Beginner' },
    { value: CursusLevel.INTERMEDIATE, label: 'Intermediate' },
    { value: CursusLevel.ADVANCED, label: 'Advanced' }
  ];

  // Basit string array olarak kategori seçenekleri
  categoryOptions = CATEGORY_OPTIONS;

  constructor(private api: Api, private cdr: ChangeDetectorRef, private router: Router) { }

  // Form validasyonu
  validateForm(): boolean {
    this.validationErrors = [];
    
    const titleValidation = ValidCurs.validateTitle(this.newCurs.title);
    if (!titleValidation.isValid) {
      this.validationErrors.push(titleValidation.message);
    }

    const descriptionValidation = ValidCurs.validateDescription(this.newCurs.description);
    if (!descriptionValidation.isValid) {
      this.validationErrors.push(descriptionValidation.message);
    }

    const durationValidation = ValidCurs.validateDuration(this.newCurs.duration);
    if (!durationValidation.isValid) {
      this.validationErrors.push(durationValidation.message);
    }

    const levelValidation = ValidCurs.validateLevel(this.newCurs.level);
    if (!levelValidation.isValid) {
      this.validationErrors.push(levelValidation.message);
    }

    const instructorValidation = ValidCurs.validateInstructor(this.newCurs.instructor);
    if (!instructorValidation.isValid) {
      this.validationErrors.push(instructorValidation.message);
    }

    const priceValidation = ValidCurs.validatePrice(this.newCurs.price);
    if (!priceValidation.isValid) {
      this.validationErrors.push(priceValidation.message);
    }

    const categoryValidation = ValidCurs.validateCategory(this.newCurs.category);
    if (!categoryValidation.isValid) {
      this.validationErrors.push(categoryValidation.message);
    }

    return this.validationErrors.length === 0;
  }

  // Kurs ekleme işlemi
  addCourse(): void {
    if (this.isSubmitting) return;

    if (!this.validateForm()) {
      console.log('Validasyon hataları:', this.validationErrors);
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;

    // createdAt'i güncel tarih ile güncelle
    this.newCurs.createdAt = new Date().toISOString();

    this.api.addCursus(this.newCurs).subscribe({
      next: (response) => {
        console.log('Kurs başarıyla eklendi:', response);
        this.submitSuccess = true;
        this.resetForm();
        this.isSubmitting = false;
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.router.navigate(['/cursus']);
        }, 2000);
      },
      error: (error) => {
        console.error('Kurs eklenirken hata oluştu:', error);
        this.validationErrors = ['Kurs eklenirken bir hata oluştu. Lütfen tekrar deneyin.'];
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Formu sıfırla - Factory function kullan
  resetForm(): void {
    this.newCurs = createEmptyCursus();
    this.validationErrors = [];
    this.submitSuccess = false;
  }

  // Kurslar sayfasına geri dön
  goBack(): void {
    this.router.navigate(['/cursus']);
  }
}


