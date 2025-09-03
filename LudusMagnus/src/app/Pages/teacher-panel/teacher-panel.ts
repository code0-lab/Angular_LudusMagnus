import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherGuard } from '../../guards/teacher.guard';

@Component({
  selector: 'app-teacher-panel',
  imports: [],
  templateUrl: './teacher-panel.html',
  styleUrl: './teacher-panel.css'
})
export class TeacherPanel {

  constructor(
    private router: Router,
    private teacherGuard: TeacherGuard
  ) {}

  navigateToCourses() {
    if (this.teacherGuard.teacherOrAdminRole) {
      console.log('Admin veya teacher rolüne sahip')
    } else {
      this.router.navigate(['/unauthorized']);
    }
  }
}
