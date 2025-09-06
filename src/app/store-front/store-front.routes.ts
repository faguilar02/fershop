import { Routes } from '@angular/router';
import { StoreFrontLayoutComponent } from './layouts/store-front-layout/store-front-layout.component';

export const storeFrontRoutes: Routes = [
  {
    path: '',
    component: StoreFrontLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home-page/home-page.component'),
      },
      {
        path: 'gender/:gender',
        loadComponent: () =>
          import('./pages/gender-page/gender-page.component'),
      },

      {
        path: 'product/:idSlug',
        loadComponent: () =>
          import('./pages/product-page/product-page.component'),
      },

      {
        path: '**',
        loadComponent: () =>
          import('./pages/not-found-page/not-found-page.component'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default storeFrontRoutes;
