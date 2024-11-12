import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { HomeComponent } from './component/home/home.component';
import { CrearCuentaComponent } from './component/login/crear-cuenta/crear-cuenta.component';
import { AuthGuardService } from './service/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: CrearCuentaComponent
  },
  {
    path: 'components',
    loadChildren: () => import('./component/component.module').then((m) => m.ComponentModule),
    canActivate: [AuthGuardService]  // Proteger rutas que requieren autenticación
  }
];
