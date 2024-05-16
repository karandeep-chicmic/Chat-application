import { Routes } from '@angular/router';
import { HomeCompComponent } from './components/home-comp/home-comp.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/userAuth/login/login.component';
import { RegisterComponent } from './components/userAuth/register/register.component';
import { ChatHomeComponent } from './components/chat-pages/chat-home/chat-home.component';
import { canActivate } from './services/guards/auth.guard';
import { ForgotPasswordComponent } from './components/userAuth/forgot-password/forgot-password.component';
import { ROUTES } from './constants/allConstants';
import { TestingComponent } from './components/testing/testing.component';

export const routes: Routes = [
  {
    path: ROUTES.DEFAULT,
    redirectTo: ROUTES.HOME_COMPONENT,
    pathMatch: 'full',
  },
  { path: ROUTES.HOME_COMPONENT, component: HomeCompComponent },
  { path: ROUTES.LOGIN, component: LoginComponent },
  { path: ROUTES.REGISTER, component: RegisterComponent },
  {
    path: ROUTES.CHAT_HOME,
    component: ChatHomeComponent,
    canActivate: [canActivate],
  },
  { path: ROUTES.FORGOT_PASS, component: ForgotPasswordComponent },
  { path: ROUTES.TESTING, component: TestingComponent },
  { path: ROUTES.WILDCARD, component: PageNotFoundComponent },
];
