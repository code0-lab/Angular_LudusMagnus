import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Api } from '../../services/api';
import { ICourses } from '../../models/Icourses';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { IComment } from '../../models/IComment';


@Component({
  selector: 'app-course-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css'
})
export class CourseDetails implements OnInit {
  details: ICourses = {} as ICourses;
  comments: IComment[] = [];
  courseId: string | null = null;
  isLoading: boolean = true;
  isLoadingComments: boolean = false;
  userId: string | null = null;
  savedCurs: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private api: Api,
    private cd: ChangeDetectorRef,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    //console.log('Course ID:', this.courseId);
    this.userId = this.authService.getCurrentUser()?.id || null;
    //console.log('User ID:', this.userId);
    this.isSaved();
    
    if (this.courseId) {
      // String ID'yi direkt kullan, number'a çevirmeye gerek yok
      this.loadCourseDetails(this.courseId);
      this.loadComments(this.courseId);
    }
  }

  // loadCourseDetails metodunu da güncelleyelim
  loadCourseDetails(id: string): void {
    //this.isLoading = true;
    this.api.getCoursesById(id).subscribe({
      next: (course) => {
        this.details = course;
        this.isLoading = false;
        this.cd.detectChanges();
        console.log('Kurs detayları yüklendi:', course);
      },
      error: (error) => {
        console.error('Kurs detayları yüklenirken hata oluştu:', error);
        this.isLoading = false;
        this.cd.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  loadComments(courseId: string): void {
    this.isLoadingComments = true;
    this.api.getCommentsByCourseId(courseId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoadingComments = false;
        this.cd.detectChanges();
        console.log('Yorumlar yüklendi:', comments);
      },
      error: (error) => {
        console.error('Yorumlar yüklenirken hata oluştu:', error);
        this.isLoadingComments = false;
        this.cd.detectChanges();
      }
    });
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0); // 5 elemanlı bir boş dizi ilk başta tanımlanmamış elemanları vardır.
  }// fill metodu ile 0'ları doldurduk ve map ile elemanları dizide bulunduğu konum ile gelen değer karşılaştırılır eğer değer 0. eleman ile kıyaslanır ise 
  // gelen değer 1 olsun 0. eleman doldurulur gibi...

  save(): void {
    //console.log('Kurs ID:', this.courseId);
    //console.log('user ID:', this.userId);
  if(this.savedCurs){
    const confirmDelete = confirm('Are you sure you want to delete this course from your saved list?');
    if(confirmDelete){
      //console.log('Kurs silindi:', this.courseId);
      this.api.removeCourse(this.userId!, this.courseId!).subscribe({
        next: (response) => {
          //console.log('Kurs silindi:', response);
          this.savedCurs = false;
          this.cd.detectChanges();
        },
        error: (error) => {
          console.error('Kurs silinirken hata oluştu:', error);
        }
      });
    }else{
      console.log('Kurs silme işlemi iptal edildi');
    }
  }
    else if (this.courseId && this.userId) {
      this.api.saveCourse(this.userId, this.courseId).subscribe({
        next: (response) => {
          console.log('Kurs kaydedildi:', response);
          this.savedCurs = true;
          this.cd.detectChanges();
          // Kaydetme işlemi başarılı, kullanıcıya bildirim gösterilebilir
          alert('curs saved!');
        },
        error: (error) => {
          console.error('Kurs kaydedilirken hata oluştu:', error);
          // Kaydetme işlemi başarısız, kullanıcıya hata bildirimi gösterilebilir
          alert('curs save failed!');
          this.cd.detectChanges();
        }
      });
    } else {
      console.error('Kurs ID veya Kullanıcı ID eksik');
      alert('Please login!');
      this.cd.detectChanges();
    }
  }

  //save control kurs giriş yapmış kullanıcının savedcurs kısmında kyıtlı mı?
  isSaved(): void {
    if (this.userId) {
      this.api.getUser(this.userId).subscribe({
        next: (user) => {
          console.log('User details:', user);
          if (user.savedCourses?.includes(this.courseId!)) {
            this.savedCurs = true;
            //console.log('Kurs zaten kaydedilmiş');
            this.cd.detectChanges();
          } else {
            this.savedCurs = false;
            //console.log('Kurs kaydedilmemiş');
          }
        }
      })
    }
  }
}
