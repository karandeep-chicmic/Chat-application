import { Routes } from '@angular/router';
import { HomeCompComponent } from './components/home-comp/home-comp.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/userAuth/login/login.component';
import { RegisterComponent } from './components/userAuth/register/register.component';
import { ChatHomeComponent } from './components/chat-pages/chat-home/chat-home.component';
import { canActivate, canActivateLogin } from './services/guards/auth.guard';
import { ForgotPasswordComponent } from './components/userAuth/forgot-password/forgot-password.component';
import { ROUTES } from './constants/allConstants';
import { TestingComponent } from './components/testing/testing.component';
import { ChatComponent } from './components/chat-pages/chat/chat.component';

export const routes: Routes = [
  {
    path: ROUTES.DEFAULT,
    redirectTo: ROUTES.LOGIN,
    pathMatch: 'full',
  },
  { path: ROUTES.HOME_COMPONENT, component: HomeCompComponent },
  {
    path: ROUTES.LOGIN,
    component: LoginComponent,
    canActivate: [canActivateLogin],
  },
  {
    path: ROUTES.REGISTER,
    component: RegisterComponent,
    canActivate: [canActivateLogin],
  },
  {
    path: ROUTES.CHAT_HOME,
    component: ChatHomeComponent,
    canActivate: [canActivate],
  },
  { path: ROUTES.FORGOT_PASS, component: ForgotPasswordComponent,canActivate: [canActivate], },
  { path: ROUTES.TESTING, component: TestingComponent },
  { path: ROUTES.CHAT, component: ChatComponent},
  { path: ROUTES.WILDCARD, component: PageNotFoundComponent },
];
