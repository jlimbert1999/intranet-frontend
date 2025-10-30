import { Routes } from '@angular/router';

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
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import(
        './administration/presentation/layout/admin-layout/admin-layout.component'
      ),
    children: [
      {
        path: 'content-settings',
        loadComponent: () =>
          import(
            './administration/presentation/pages/content-settings/content-settings'
          ),
      },
      {
        path: 'file-explorer',
        loadComponent: () =>
          import(
            './administration/presentation/pages/document-management/document-management'
          ),
      },
      {
        path: 'document-sections',
        loadComponent: () =>
          import(
            './administration/presentation/pages/document-sectons-manage/document-sectons-manage.component'
          ),
      },
      {
        path: 'document-categories',
        loadComponent: () =>
          import(
            './administration/presentation/pages/document-categories/document-categories.component'
          ),
      },
      {
        path: 'communications-manage',
        loadComponent: () =>
          import(
            './administration/presentation/pages/communications-manage/communications-manage.component'
          ),
      },
      {
        path: 'calendar-manage',
        loadComponent: () =>
          import(
            './administration/presentation/pages/calendar-manage.component/calendar-manage.component'
          ),
      },
    ],
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
