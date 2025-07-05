import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'register-user',
    loadComponent: () =>
      import('./pages/register-user/register-user.component').then(
        m => m.RegisterUserComponent
      )
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(
        m => m.LoginComponent
      )
  },
  {
  path: 'chat',
  loadComponent: () =>
    import('./pages/chat/chat.component').then(m => m.ChatComponent)
  }
];
