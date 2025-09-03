import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserUrl, CursusUrl, CommentUrl, EnrollUrl } from '../Utils/apiUrl'; // CursusUrl eklendi
import { Observable, switchMap, throwError } from 'rxjs'; // switchMap ve throwError eklendi
import { IUser } from '../models/IUser';
import { ICursus } from '../models/ICursus'; // ICursus eklendi
import { IComment } from '../models/IComment';
import { IEnroll } from '../models/IEnroll';
import { User } from '../Pages/user/user';

@Injectable({
  providedIn: 'root'
})
export class Api {
  constructor(private http: HttpClient) { }

  // Tüm kullanıcıları getir
  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(UserUrl.Ushers);
  }

  // Tek bir kullanıcı getir
  getUser(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${UserUrl.Ushers}/${id}`);
  }

  // Belirli parametrelerle kullanıcıları getir (başarısız json server ile uyumsuz)
  //Users(id: number, name: string, email: string, password: string) {
   // const sendObj = {
   //   id: id,
   //   name: name,
    //  email: email,
   //  password: password
//  }
   // return this.http.get<IUser>(UserUrl.Ushers, {params: sendObj})
//  }

  //Kullanıcı ekle (mevcut - basit versiyon)
  addUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(UserUrl.Ushers, user);
  }

  // Kullanıcı ekle (validation ile - YENİ)
  addUserWithValidation(user: IUser): Observable<IUser> {
    return this.getUsers().pipe(
      switchMap(existingUsers => {
        // Email kontrolü
        const emailExists = existingUsers.some(u => u.email === user.email);
        if (emailExists) {
          return throwError(() => new Error(`This email is already in use: ${user.email}`));
        }

        // İsteğe bağlı: İsim kontrolü de eklenebilir
        // const nameExists = existingUsers.some(u => u.name === user.name);
        // if (nameExists) {
        //   return throwError(() => new Error(`Bu isim zaten kullanılıyor: ${user.name}`));
        // }

        // Validation geçtiyse kullanıcıyı ekle
        return this.http.post<IUser>(UserUrl.Ushers, user);
      })
    );
  }

  // Tüm kursları getir - DÜZELTİLDİ
  getCursus(): Observable<ICursus[]> {
    return this.http.get<ICursus[]>(CursusUrl.Cursus);
  }

  // Tek bir kurs getir
  getCursusById(id: string): Observable<ICursus> {
    return this.http.get<ICursus>(`${CursusUrl.Cursus}/${id}`);
  }

  // Seviyeye göre kursları getir
  getCursusByLevel(level: string): Observable<ICursus[]> {
    return this.http.get<ICursus[]>(`${CursusUrl.Cursus}?level=${level}`);
  }

  // Aktif kursları getir
  getActiveCursus(): Observable<ICursus[]> {
    return this.http.get<ICursus[]>(`${CursusUrl.Cursus}?isActive=true`);
  }
  // Kurs ekle
  addCursus(cursus: ICursus): Observable<ICursus> {
    return this.http.post<ICursus>(CursusUrl.Cursus, cursus);
  }

  // Kurs ara
// Kurs ara - title ve description'da arama yap
searchCursus(query: string): Observable<ICursus[]> {
console.log('API search query:', query);
  // json-server'da q parametresi full-text search yapar
  return this.http.get<ICursus[]>(`${CursusUrl.Cursus}?q=${query}`);
}

  // Kursu kullanıcının profiline kaydet
  saveCourse(userId: string, courseId: string): Observable<IUser> {
    // Önce kullanıcıyı getir
    return this.http.get<IUser>(`${UserUrl.Ushers}/${userId}`).pipe(
      switchMap(user => {
        // savedCourses dizisi yoksa oluştur kullanıcı oluşturma fonksiyonuna bu kısmı eklemedik:))
        // Bundan dolayı bu fonksiyon hiç kullanılmamış ise savedCourses dizisi oluşmaz.
        if (!user.savedCourses) {
          user.savedCourses = [];
        }
        
        // Kurs zaten kaydedilmişse ekleme gerçek bir backend olmadığı için güüvebsizlikten aapi içinde kontrolü ek olarak yapıyorum:)
        if (!user.savedCourses.includes(courseId)) {
          user.savedCourses.push(courseId);
        }
        
        // Kullanıcıyı güncelle
        return this.http.put<IUser>(`${UserUrl.Ushers}/${userId}`, user);
      })
    );
  }

  // Kursu kullanıcının profiline sil olmayan dosya zaten silinmez dolayısı ile ek kontole gerek yon
  removeCourse(userId: string, courseId: string): Observable<IUser> {
    // Önce kullanıcıyı getir
    return this.http.get<IUser>(`${UserUrl.Ushers}/${userId}`).pipe(
      switchMap(user => {
          user.savedCourses = user.savedCourses?.filter(id => id !== courseId) || [];
        // Kullanıcıyı güncelle
        return this.http.put<IUser>(`${UserUrl.Ushers}/${userId}`, user);
      })
    );
  }

  //Login

  userLogin(username: string, password: string) {
    return this.http.get<IUser[]>(`${UserUrl.Ushers}?email=${username}&password=${password}`);
  }

  // Yorumlar için API metodları
  getCommentsByCourseId(courseId: string): Observable<IComment[]> {
    return this.http.get<IComment[]>(`${CommentUrl.Comments}?courseId=${courseId}&isApproved=true`);
  }

  addComment(comment: IComment): Observable<IComment> {
    return this.http.post<IComment>(`${CommentUrl.Comments}`, comment);
  }

  getAllComments(): Observable<IComment[]> {
    return this.http.get<IComment[]>(`${CommentUrl.Comments}`);
  }

  // Enrollments için API metodları
  getEnrollments(): Observable<IEnroll[]> {
    return this.http.get<IEnroll[]>(`${EnrollUrl.Enrollments}`);
  }

  // Kullanıcının kayıtlı olduğu kursları getir
  getUserEnrollments(userId: string): Observable<IEnroll[]> {
    return this.http.get<IEnroll[]>(`${EnrollUrl.Enrollments}?userId=${userId}`);
  }

  // Kullanıcının belirli bir kursa kayıtlı olup olmadığını kontrol et
  checkUserEnrollment(userId: string, courseId: string): Observable<IEnroll[]> {
    return this.http.get<IEnroll[]>(`${EnrollUrl.Enrollments}?userId=${userId}&courseId=${courseId}`);
  }

  // Yeni kayıt ekle
  addEnrollment(enrollment: IEnroll): Observable<IEnroll> {
    return this.http.post<IEnroll>(`${EnrollUrl.Enrollments}`, enrollment);
  }

  // Kayıt sil
  removeEnrollment(enrollmentId: string): Observable<any> {
    return this.http.delete(`${EnrollUrl.Enrollments}/${enrollmentId}`);
  }

  // Kullanıcı güncelle
  updateUser(id: string, user: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${UserUrl.Ushers}/${id}`, user);
  }
}
