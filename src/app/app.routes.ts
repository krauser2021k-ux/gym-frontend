import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'students',
    loadComponent: () => import('./features/students/students-list.component').then(m => m.StudentsListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'students/new',
    loadComponent: () => import('./features/students/student-form.component').then(m => m.StudentFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'exercises',
    loadComponent: () => import('./features/exercises/exercises-library.component').then(m => m.ExercisesLibraryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'routines',
    loadComponent: () => import('./features/routines/routines-list.component').then(m => m.RoutinesListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'routines/new',
    loadComponent: () => import('./features/routines/routine-form.component').then(m => m.RoutineFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-routine',
    loadComponent: () => import('./features/routines/my-routine.component').then(m => m.MyRoutineComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gyms',
    loadComponent: () => import('./features/gyms/gyms-list.component').then(m => m.GymsListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'blocks',
    loadComponent: () => import('./features/blocks/blocks-list.component').then(m => m.BlocksListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'blocks/new',
    loadComponent: () => import('./features/blocks/block-form.component').then(m => m.BlockFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'blocks/edit/:id',
    loadComponent: () => import('./features/blocks/block-form.component').then(m => m.BlockFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'payments',
    loadComponent: () => import('./features/payments/payments-checkout.component').then(m => m.PaymentsCheckoutComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile-edit.component').then(m => m.ProfileEditComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard-advanced',
    loadComponent: () => import('./features/dashboard/dashboard-advanced.component').then(m => m.DashboardAdvancedComponent),
    canActivate: [authGuard]
  },
  {
    path: 'progress',
    loadComponent: () => import('./features/progress/progress-tracker.component').then(m => m.ProgressTrackerComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'preferences',
    loadComponent: () => import('./features/preferences/preferences.component').then(m => m.PreferencesComponent),
    canActivate: [authGuard]
  }
];
