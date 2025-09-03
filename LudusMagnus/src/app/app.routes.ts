import { Routes } from '@angular/router';
import { CerberusGuard } from './guards/cerberus.guard';
import { TeacherGuard } from './guards/teacher.guard';

// Mevcut component'ler
import { Register } from './Pages/register/register';
import { User } from './Pages/user/user';
import { Cursus } from './Pages/cursus/cursus';
import { Login } from './Pages/login/login';
import { CourseDetails } from './Pages/course-details/course-details';
import { Search } from './Pages/search/search';
import { EnrollCurs } from './Pages/enroll-curs/enroll-curs'; 
import { NewCurs } from './Pages/newCurs/newCurs';
import { TeacherPanel } from './Pages/teacher-panel/teacher-panel';
import NotFound from './components/not-found/not-found';
import UnauthorizedComponent from './components/unauthorized/unauthorized';

export const routes: Routes = [
  // Ana sayfa - cursus'a yönlendir (herkese açık)
  { 
    path: '', 
    component: Cursus
  },
  
  { path: 'user', component: User },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  
  // Cursus sayfası (herkese açık)
  { 
    path: 'cursus', 
    component: Cursus
  },
  
  // Yeni kurs oluşturma sayfası - Sadece teacher ve admin erişebilir
  {
    path: 'newCurs',
    component: NewCurs,
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
    path: 'enroll-curs/:id',
    component: EnrollCurs,
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
