import { Routes } from '@angular/router';
import storeFrontRoutes from './store-front/store-front.routes';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      NotAuthenticatedGuard
    ]

  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes')
  },

];
