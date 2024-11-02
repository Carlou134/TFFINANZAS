import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DeudoresListarComponent } from './deudores-listar/deudores-listar.component';


@Component({
  selector: 'app-deudores',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DeudoresListarComponent
  ],
  templateUrl: './deudores.component.html',
  styleUrl: './deudores.component.css'
})
export class DeudoresComponent {
  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {}
}
