import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CarteraListarComponent } from './cartera-listar/cartera-listar.component';

@Component({
  selector: 'app-cartera',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CarteraListarComponent
  ],
  templateUrl: './cartera.component.html',
  styleUrl: './cartera.component.css'
})
export class CarteraComponent {
  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {}
}
