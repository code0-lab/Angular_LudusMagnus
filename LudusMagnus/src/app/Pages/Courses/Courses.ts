import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Api } from '../../services/api';
import { ICourses } from '../../models/Icourses';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-Courses',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './Courses.html',
  styleUrl: './Courses.css'
})
export class Courses implements OnInit { //yarı türkçe yarı ingilizce olduğu yetmez gibi dosya adıda flamenkçe :))
  cursus: ICourses[] = [];
  paginatedCursus: ICourses[] = []; // Sayfalanmış kurslar
  isloading: boolean = true;
  role: boolean = false;
  isEnrolled = false;
  
  // Pagination özellikleri
  currentPage: number = 1;
  cursusPerPage: number = 9;
  totalPages: number = 0;

  constructor(
    private api: Api, 
    private cd: ChangeDetectorRef,
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCursus();
    this.checkRole(); // bu unutulduğu için html de bulunması gereken + gelmiyordu :)
  }

  // Kullanıcı rolünü kontrol et
  checkRole(): void {
    if (this.authService.getUserRole() === 'admin' || this.authService.getUserRole() === 'teacher') {
      this.role = true;
      //console.log('Rol:', this.role);
      this.cd.detectChanges();
    } else {
      this.role = false;
      this.cd.detectChanges();
    }
  }

  //Kursları say ve sayfa sayısını hesapla
  PageCount(): number {
    console.log('Kurs sayısı:', this.cursus.length) 
    //sayfa sayısını hesapla
    this.totalPages = Math.ceil(this.cursus.length / this.cursusPerPage);
    console.log('Toplam sayfa sayısı:', this.totalPages);
    return this.totalPages;
  }

  // Sayfalanmış kursları getir
  getPaginatedCursus(): void {
    const startIndex = (this.currentPage - 1) * this.cursusPerPage;
    const endIndex = startIndex + this.cursusPerPage;
    this.paginatedCursus = this.cursus.slice(startIndex, endIndex);
  }

  // Sayfa değiştir
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getPaginatedCursus();
    }
  }

  // Önceki sayfa
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getPaginatedCursus();
    }
  }

  // Sonraki sayfa
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getPaginatedCursus();
    }
  }

  // Sayfa numaralarını getir (pagination için)
  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  loadCursus(): void {
    this.api.getCourses().subscribe({
      next: (value) => {
        this.cursus = value;
        this.PageCount(); // Sayfa sayısını hesapla
        this.getPaginatedCursus(); // İlk sayfayı yükle
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Kurs bilgileri alınırken hata oluştu:', error);
        this.isloading = false;
        this.cd.detectChanges();
      },
      complete: () => {
        this.isloading = false; 
        this.cd.detectChanges();
      }
    });
  }

  registerToCourse(event: Event, courseId: number): void {
    event.stopPropagation();
    event.preventDefault();
    console.log('Kursa kayıt:', courseId);
  }
  
  navigateToNewCourse() {
    this.router.navigate(['/newCours']);
  }
}
