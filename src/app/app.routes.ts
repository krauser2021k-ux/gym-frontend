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
    path: 'students/:studentId/routines',
    loadComponent: () => import('./features/students/student-routines.component').then(m => m.StudentRoutinesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'students/:studentId',
    loadComponent: () => import('./features/students/student-form.component').then(m => m.StudentFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'biblioteca',
    loadComponent: () => import('./features/biblioteca/biblioteca.component').then(m => m.BibliotecaComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'ejercicios',
        pathMatch: 'full'
      },
      {
        path: 'ejercicios',
        loadComponent: () => import('./features/exercises/exercises-library.component').then(m => m.ExercisesLibraryComponent)
      },
      {
        path: 'bloques',
        loadComponent: () => import('./features/blocks/blocks-list.component').then(m => m.BlocksListComponent)
      },
      {
        path: 'rutinas',
        loadComponent: () => import('./features/routines/routines-list.component').then(m => m.RoutinesListComponent)
      },
      {
        path: 'programas',
        loadComponent: () => import('./features/programs/programs-list.component').then(m => m.ProgramsListComponent)
      }
    ]
  },
  {
    path: 'exercises',
    loadComponent: () => import('./features/exercises/exercises-library.component').then(m => m.ExercisesLibraryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'exercises/new',
    loadComponent: () => import('./features/exercises/exercise-form.component').then(m => m.ExerciseFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'exercises/edit/:id',
    loadComponent: () => import('./features/exercises/exercise-form.component').then(m => m.ExerciseFormComponent),
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
    path: 'routines/assign/:studentId',
    loadComponent: () => import('./features/routines/routine-assign.component').then(m => m.RoutineAssignComponent),
    canActivate: [authGuard]
  },
  {
    path: 'routines/:routineId',
    loadComponent: () => import('./features/routines/routine-detail.component').then(m => m.RoutineDetailComponent),
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
    redirectTo: '/student/payments/plans',
    pathMatch: 'full'
  },
  {
    path: 'student/payments/plans',
    loadComponent: () => import('./features/payments/student-payment-plans.component').then(m => m.StudentPaymentPlansComponent),
    canActivate: [authGuard]
  },
  {
    path: 'student/payments/history',
    loadComponent: () => import('./features/payments/student-payment-history.component').then(m => m.StudentPaymentHistoryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'trainer/payments',
    loadComponent: () => import('./features/payments/trainer-payments-list.component').then(m => m.TrainerPaymentsListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'trainer/payments/new',
    loadComponent: () => import('./features/payments/trainer-payment-form.component').then(m => m.TrainerPaymentFormComponent),
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
  },
  {
    path: 'trainer/payment-plans',
    loadComponent: () => import('./features/payment-plans/trainer-payment-plans-list.component').then(m => m.TrainerPaymentPlansListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'trainer/payment-plans/new',
    loadComponent: () => import('./features/payment-plans/payment-plan-form.component').then(m => m.PaymentPlanFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'trainer/payment-plans/edit/:id',
    loadComponent: () => import('./features/payment-plans/payment-plan-form.component').then(m => m.PaymentPlanFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'trainer/payment-plans/assign',
    loadComponent: () => import('./features/payment-plans/assign-plan-to-student.component').then(m => m.AssignPlanToStudentComponent),
    canActivate: [authGuard]
  },
  {
    path: 'trainer/students/plans-overview',
    loadComponent: () => import('./features/payment-plans/student-plans-overview.component').then(m => m.StudentPlansOverviewComponent),
    canActivate: [authGuard]
  },
  {
    path: 'programs',
    loadComponent: () => import('./features/programs/programs-list.component').then(m => m.ProgramsListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'programs/new',
    loadComponent: () => import('./features/programs/program-form.component').then(m => m.ProgramFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'programs/edit/:id',
    loadComponent: () => import('./features/programs/program-form.component').then(m => m.ProgramFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'programs/assign/:programId',
    loadComponent: () => import('./features/programs/program-assign.component').then(m => m.ProgramAssignComponent),
    canActivate: [authGuard]
  },
  {
    path: 'programs/:id',
    loadComponent: () => import('./features/programs/program-detail.component').then(m => m.ProgramDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-program',
    loadComponent: () => import('./features/programs/my-program.component').then(m => m.MyProgramComponent),
    canActivate: [authGuard]
  },
  {
    path: 'trainer/student-programs',
    loadComponent: () => import('./features/programs/student-program-progress.component').then(m => m.StudentProgramProgressComponent),
    canActivate: [authGuard]
  }
];
