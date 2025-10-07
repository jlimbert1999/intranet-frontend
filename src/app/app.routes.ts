import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'portal',
    loadComponent: () =>
      import(
        './portal/presentation/layouts/portal-layout/portal-layout.component'
      ),
    children: [
      {
        path: 'repository',
        loadComponent: () =>
          import(
            './portal/presentation/pages/document-repository/document-repository.component'
          ),
      },
      {
        path: 'repository/category/:id',
        loadComponent: () =>
          import(
            './portal/presentation/pages/documents-by-category/documents-by-category.component'
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
    ],
  },
  { path: '', redirectTo: 'portal', pathMatch: 'full' },
  { path: '**', redirectTo: 'portal' },
];
