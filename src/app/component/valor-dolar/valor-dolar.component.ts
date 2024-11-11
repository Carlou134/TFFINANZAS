import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ValorDolarListarComponent } from './valor-dolar-listar/valor-dolar-listar.component';

@Component({
  selector: 'app-valor-dolar',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ValorDolarListarComponent
  ],
  templateUrl: './valor-dolar.component.html',
  styleUrl: './valor-dolar.component.css'
})
export class ValorDolarComponent {
  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {}
}
