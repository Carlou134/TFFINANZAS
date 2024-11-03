import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DocumentosListarComponent } from './documentos-listar/documentos-listar.component';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DocumentosListarComponent
  ],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css'
})
export class DocumentosComponent {
  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {}
}
