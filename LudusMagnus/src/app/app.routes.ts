import { Routes } from '@angular/router';
import { CerberusGuard } from './guards/cerberus.guard';
import { TeacherGuard } from './guards/teacher.guard';

// Mevcut component'ler
import { Register } from './Pages/register/register';
import { User } from './Pages/user/user';
import { Courses } from './Pages/Courses/Courses';
import { Login } from './Pages/login/login';
import { CourseDetails } from './Pages/course-details/course-details';
import { Search } from './Pages/search/search';
import { EnrollCourse } from './Pages/enroll-Course/enroll-Course'; 
import { newCours } from './Pages/NewCours/newCours';
import { EditCourse } from './Pages/edit-course/edit-course';
import { AdminPanel } from './Pages/admin-panel/admin-panel';
import { TeacherPanel } from './Pages/teacher-panel/teacher-panel';
import NotFound from './components/not-found/not-found';
import UnauthorizedComponent from './components/unauthorized/unauthorized';
import About  from './components/about/about';
import contact from './components/contact/contact';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Ana sayfa - cursus'a yönlendir (herkese açık)
  { 
    path: '', 
    component: Courses
  },
  
  { path: 'user', component: User },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  
  // Courses sayfası (herkese açık)
  { 
    path: 'Courses', 
    component: Courses
  },
  {
    path: 'about',
    component: About
  },
  {
    path: 'contact',
    component: contact
  },
  
  // Yeni kurs oluşturma sayfası - Sadece teacher ve admin erişebilir
  {
    path: 'admin-panel',
    component: AdminPanel,
    canActivate: [AdminGuard]
  },
  {
    path: 'newCours',
    component: newCours,
    canActivate: [TeacherGuard]
  },
  
  // Kurs düzenleme sayfası - Sadece teacher ve admin erişebilir
  {
    path: 'edit-course/:id',
    component: EditCourse,
    canActivate: [TeacherGuard]
  },
  // Teacher panel sayfası - Sadece teacher ve admin erişebilir
  {
    path: 'teacher-panel',
    component: TeacherPanel,
    canActivate: [TeacherGuard]
  },
  
  // Kurs kayıt sayfası - ID parametresi ile
  {
    path: 'enroll-Course/:id',
    component: EnrollCourse,
    canActivate: [CerberusGuard]
  },
  
  // Search sayfası
  {
    path: 'search',
    component: Search
  },
  
  // Kurs detay sayfası (parametreli rotalar en sonda olmalı)
  {
    path: 'course-details/:id',
    component: CourseDetails
  },
  
  // Unauthorized sayfası - Yetkisiz erişim için
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  
  // Not found sayfası
  {
    path: 'not-found',
    component: NotFound
  },
  
  // Geçersiz route'lar için wildcard - not-found'a yönlendir
  { path: '**', redirectTo: '/not-found' }
];
