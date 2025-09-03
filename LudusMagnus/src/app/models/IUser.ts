export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student' | 'guest';
  courseId?: string;
  createdAt?: string;
  isActive?: boolean;
  courseIds?: string[];
  savedCourses?: string[];
  phone?: string;
  bio?: string;
}

export interface IRegisterModel {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'teacher' | 'student';
}

// Factory function - Yeni kayıt formu oluşturmak için
export function createEmptyRegisterModel(): IRegisterModel {
  return {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as 'teacher' | 'student' 
  };
}

// Factory function - Yeni kullanıcı oluşturmak için
export function createEmptyUser(): IUser {
  return {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: 'student',
    createdAt: new Date().toISOString(),
    isActive: true,
    phone: '',
    courseIds: [],
    savedCourses: [],
    bio: ''
  };
}

