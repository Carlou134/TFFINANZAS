import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BancosListarComponent } from './bancos-listar/bancos-listar.component';

@Component({
  selector: 'app-bancos',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BancosListarComponent
  ],
  templateUrl: './bancos.component.html',
  styleUrl: './bancos.component.css'
})
export class BancosComponent {
  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {}
}
