import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './features/administration/presentation/guards/is-authenticated-guard';
// import { isAuthenticatedGuard } from './administration/presentation/guards/is-authenticated-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './portal/presentation/layouts/portal-layout/portal-layout.component'
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './portal/presentation/pages/landing-page/landing-page.component'
          ),
      },
      {
        path: 'repository',
        loadComponent: () =>
          import(
            './portal/presentation/pages/document-repository/document-repository.component'
          ),
      },
      {
        path: 'communications',
        loadComponent: () =>
          import(
            './portal/presentation/pages/communications/communications.component'
          ),
      },
      {
        path: 'communications/:id',
        loadComponent: () =>
          import(
            './portal/presentation/pages/communication-detail/communication-detail'
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import(
            './portal/presentation/pages/institutional-calendar/institutional-calendar.component'
          ),
      },
      {
        path: 'tutorials',
        loadComponent: () =>
          import('./portal/presentation/pages/tutorials-list/tutorials-list'),
      },
      {
        path: 'tutorials/:slug',
        loadComponent: () =>
          import(
            './portal/presentation/pages/tutorials-detail/tutorials-detail'
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/administration/pages/login-page/login-page'),
  },
  {
    path: 'admin',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import(
        './features/administration/presentation/layout/admin-layout/admin-layout.component'
      ),
    children: [
      {
        path: 'content-settings',
        loadComponent: () =>
          import(
            './features/administration/pages/content-settings/content-settings'
          ),
      },
      // {
      //   path: 'file-explorer',
      //   loadComponent: () =>
      //     import(
      //       './administration/presentation/pages/document-management/document-management'
      //     ),
      // },
      // {
      //   path: 'document-sections',
      //   loadComponent: () =>
      //     import(
      //       './administration/presentation/pages/document-sectons-manage/document-sectons-manage.component'
      //     ),
      // },
      // {
      //   path: 'document-categories',
      //   loadComponent: () =>
      //     import(
      //       './administration/presentation/pages/document-categories/document-categories.component'
      //     ),
      // },
      // {
      //   path: 'communications-manage',
      //   loadComponent: () =>
      //     import(
      //       './administration/presentation/pages/communications-manage/communications-manage.component'
      //     ),
      // },
      // {
      //   path: 'calendar-manage',
      //   loadComponent: () =>
      //     import(
      //       './administration/presentation/pages/calendar-manage.component/calendar-manage.component'
      //     ),
      // },
      // {
      //   path: 'tutorials-manage',
      //   loadComponent: () =>
      //     import(
      //       './administration/presentation/pages/tutorial-manage/tutorial-manage'
      //     ),
      // },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/administration/pages/users-manage/users-manage'),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./features/administration/pages/roles-manage/roles-manage'),
      },
    ],
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
