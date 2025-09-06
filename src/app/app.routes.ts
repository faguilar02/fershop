import { Routes } from '@angular/router';
import storeFrontRoutes from './store-front/store-front.routes';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes')
  },
  
];
