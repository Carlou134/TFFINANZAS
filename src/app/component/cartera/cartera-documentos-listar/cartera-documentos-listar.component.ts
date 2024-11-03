import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Cartera } from '../../../models/Cartera';
import { CarteraService } from '../../../service/cartera.service';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-cartera-documentos-listar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatIcon,
    RouterModule
  ],
  templateUrl: './cartera-documentos-listar.component.html',
  styleUrl: './cartera-documentos-listar.component.css'
})
export class CarteraDocumentosListarComponent implements OnInit {
  carteras: Cartera[] = [];

  constructor(private tS: CarteraService) {}

  ngOnInit(): void {
    this.tS.listMiCartera().subscribe((data) => {
      this.carteras = data;
    });

    this.tS.getList().subscribe((data) => {
      this.carteras = data;
    });
  }
}
