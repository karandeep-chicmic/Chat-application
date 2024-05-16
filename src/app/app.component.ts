import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeCompComponent } from './components/home-comp/home-comp.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeCompComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
