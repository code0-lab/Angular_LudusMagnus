export interface ICursus {
  id: string; // number'dan string'e değiştirildi
  title: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  price: number;
  category: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  enrolledStudents: number;
}

// Opsiyonel: Kurs seviyesi için enum
export enum CursusLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

// Kategori seçenekleri - basit string array
export const CATEGORY_OPTIONS = [
  'Web Development',
  'Programming',
  'Data Science',
  'Mobile Development',
  'Design',
  'DevOps',
  'Other'
];

// Factory function - Yeni kurs oluşturmak için
export function createEmptyCursus(): ICursus {
  return {
    id: '0', // string olarak değiştirildi
    title: '',
    description: '',
    duration: '',
    level: 'beginner',
    instructor: '',
    price: 0,
    category: '',
    rating: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    enrolledStudents: 0
  };
}

// Partial update için helper function
export function updateCursus(cursus: ICursus, updates: Partial<ICursus>): ICursus {
  return { ...cursus, ...updates };
}