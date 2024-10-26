import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TasasListarComponent } from './tasas-listar/tasas-listar.component';

@Component({
  selector: 'app-tasas',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TasasListarComponent
  ],
  templateUrl: './tasas.component.html',
  styleUrl: './tasas.component.css'
})
export class TasasComponent {
  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {}
}

